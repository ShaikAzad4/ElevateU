from typing import Any, Dict, Optional, Tuple

from flask import current_app, request
import jwt


class AuthError(Exception):
    pass


def _get_bearer_token() -> str:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise AuthError("Missing or invalid Authorization header")
    return auth_header.split(" ", 1)[1]


def verify_clerk_token_from_request() -> Dict[str, Any]:
    """Verify Clerk session token via JWKS and return decoded claims.

    Requires env config:
      - CLERK_JWKS_URL (e.g., https://<your-domain>.clerk.accounts.dev/.well-known/jwks.json)
      - CLERK_ISSUER (e.g., https://<your-domain>.clerk.accounts.dev)
    Optional:
      - CLERK_AUDIENCE (if you want to enforce aud)
    """
    token = _get_bearer_token()

    jwks_url = current_app.config.get("CLERK_JWKS_URL")
    issuer = current_app.config.get("CLERK_ISSUER")
    audience = current_app.config.get("CLERK_AUDIENCE")
    if not jwks_url or not issuer:
        raise AuthError("Server misconfigured: missing CLERK_JWKS_URL or CLERK_ISSUER")

    jwk_client = jwt.PyJWKClient(jwks_url)
    signing_key = jwk_client.get_signing_key_from_jwt(token)

    options = {"verify_aud": bool(audience)}
    decoded = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience=audience if audience else None,
        issuer=issuer,
        options=options,
    )
    return decoded

