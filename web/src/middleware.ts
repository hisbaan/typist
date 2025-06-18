import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { config } from './config';

export default authkitMiddleware({
  redirectUri: config.NEXT_PUBLIC_WORKOS_REDIRECT_URL,
});
