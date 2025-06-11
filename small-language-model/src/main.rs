use clap::{Parser, Subcommand};
use glob::glob;
use rand::prelude::*;
use rand_chacha::ChaCha8Rng;
use rkyv::{deserialize, rancor::Error, Archive, Deserialize, Serialize};
use std::{collections::HashMap, fs};

// TODO
// - consider extending the context window a little bit, the text makes sense, but feels
//   a little disconnected. You can see the clear relation between two words, but the third
//   one throws it off
// - consider using softmax to deprioritize uncommon words
// - consider deprioirizing words that are less than 4 characters long, but not outright removing them

#[derive(Parser)]
#[command(name = "small-language-model", about = "A small language model for bespoke, deterministic, from-scratch word generation", long_about = None)]
struct Cli {
    #[clap(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    GenerateWeights {
        data_directory: String,
        weights_file: String,
    },
    Output {
        weights_file: String,
        num_words: usize,
        random_seed: Option<String>,
    },
}

#[derive(Archive, Serialize, Deserialize, Debug)]
#[rkyv(derive(Debug))]
struct Weights {
    // TODO maybe preserve ordering of the outer map if determinism really matters? linkedhashmap or something like that
    // I think this is causing some non determinism
    data: HashMap<String, HashMap<String, f64>>,
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Commands::GenerateWeights {
            data_directory,
            weights_file,
        } => generate_weights(data_directory, weights_file),
        Commands::Output {
            weights_file,
            num_words,
            random_seed,
        } => output(weights_file, num_words, random_seed),
    }
}

fn generate_weights(data_directory: String, weights_file: String) {
    eprintln!("starting...");
    let paths = get_files(&(data_directory));
    eprintln!("getting content...");
    let content = read_files(paths);
    eprintln!("cleaning content...");
    let cleaned_content = clean_files(content);
    eprintln!("generating weights...");
    let weights = make_weights(cleaned_content);
    eprintln!("writing weights...");
    write_weights(weights, weights_file);
}

fn output(weights_file: String, num_words: usize, random_seed: Option<String>) {
    let weights = read_weights(weights_file);
    let words = generate_words(weights, num_words, random_seed);
    words.iter().for_each(|w| print!("{} ", w));
    println!();
}

fn generate_words(
    weights: HashMap<String, HashMap<String, f64>>,
    num_words: usize,
    random_seed: Option<String>,
) -> Vec<String> {
    let seed: <ChaCha8Rng as SeedableRng>::Seed = match random_seed {
        Some(seed) => {
            let bytes: &[u8] = &seed.into_bytes()[..];
            let mut buf = [0; 32];
            for i in 0..bytes.len() {
                buf[i] = bytes[i];
            }
            buf
        }
        None => Default::default(),
    };
    let mut rng = ChaCha8Rng::from_seed(seed);

    let mut starting_words: Vec<&String> = weights.get(".").unwrap().keys().collect();
    starting_words.sort(); //sort_by(|a, b| a.partial_cmp(b).unwrap());
    let mut words: Vec<String> = vec![starting_words.choose(&mut rng).unwrap().to_string()];
    let mut prev_word = &words[0];

    while words.len() < num_words {
        let probs = weights.get(prev_word).unwrap();
        let random_float = rng.random::<f64>();

        // TODO consider HashMap<String, Vec<(String, f64)>> and store as sorted to avoid having to
        // sort every time
        let mut probs_vec: Vec<(&String, &f64)> = probs.iter().collect();
        probs_vec.sort_by(|a, b| a.1.partial_cmp(b.1).unwrap());

        let mut accumulator = 0.0;
        for (word, prob) in probs_vec {
            accumulator += prob;
            if random_float <= accumulator {
                if word != "." {
                    words.push(word.to_string());
                }
                prev_word = word;
                break;
            }
        }
    }

    return words;
}

/// Find all .txt files in the provided directory
///
/// * `dir`: directory to search
fn get_files(dir: &str) -> Vec<String> {
    return glob(&(dir.to_owned() + "/**/*.txt"))
        .expect("Failed to read glob")
        .filter_map(|entry| entry.ok().map(|path| path.display().to_string()))
        .collect();
}

/// Read files from paths
///
/// * `paths`: paths to read from
fn read_files(paths: Vec<String>) -> Vec<String> {
    return paths
        .iter()
        .filter_map(|path| fs::read_to_string(path).ok())
        .collect();
}

/// Takes a list of strings (each string is one file's content) and output a list of cleaned
/// strings (each string is one word or a period).
///
/// * `contents`: list of strings where each string is the contents of one full file
fn clean_files(contents: Vec<String>) -> Vec<String> {
    return contents
        .iter()
        .map(|string| {
            // simple replacements
            let mut s = string
                .to_lowercase()
                // remove line endings
                .replace("\n", " ")
                // hyphen to space
                .replace("-", " ")
                // punctuation to period
                .replace("...", ".")
                .replace(". . .", ".")
                .replace("!", ".")
                .replace("?", ".")
                .replace(".", " . ");

            // filter out all unwanted characters
            s = s
                .chars()
                .filter_map(|c| match c {
                    'a'..='z' | ' ' | '.' => Some(c),
                    _ => None,
                })
                .collect::<String>();

            return s;
        })
        .collect::<String>()
        .split_whitespace()
        .map(str::to_string)
        .collect();
}

/// Generate a list of word following frequencies from the provided vec of words
///
/// * `words`: A vec of words used to calculate following frequencies
fn make_weights(words: Vec<String>) -> HashMap<String, HashMap<String, f64>> {
    // Get counts of each word following another word
    let mut counts: HashMap<String, HashMap<String, usize>> = HashMap::new();
    let mut prev_word = "".to_string();
    for word in words {
        let prev_word_counts = counts
            .entry(prev_word.to_string())
            .or_insert_with(|| HashMap::new());
        *prev_word_counts
            .entry(word.to_string())
            .or_insert_with(|| 0) += 1;
        prev_word = word.to_string();
    }

    // Convert the counts into frequencies
    let mut weights: HashMap<String, HashMap<String, f64>> = HashMap::new();
    for (key, val) in counts {
        let total: usize = val.values().sum();
        let mut word_weights = HashMap::new();
        for (word, count) in val {
            // TODO consider softmax, want to deprioritize uncommon words
            word_weights.insert(word, count as f64 / total as f64);
        }
        weights.insert(key, word_weights);
    }

    return weights;
}

fn write_weights(weights: HashMap<String, HashMap<String, f64>>, path: String) {
    let bytes = rkyv::to_bytes::<Error>(&weights).unwrap();
    fs::write(path, bytes).unwrap();
}

fn read_weights(path: String) -> HashMap<String, HashMap<String, f64>> {
    let file = fs::read(path).unwrap();
    let archived = rkyv::access::<ArchivedWeights, Error>(&file[..]).unwrap();
    let deserialized = deserialize::<Weights, Error>(archived).unwrap();
    return deserialized.data;
}
