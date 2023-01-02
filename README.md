# Historify

**Primitive Spotify history extractor**

## `.env` file

```
VITE_CLIENT_ID=abc123
VITE_CLIENT_SECRET=def456
VITE_REDIRECT_URI=http://localhost:8080/callback
```

## ToDo

https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks

- optimize --- app is too slow
- Fetch whole history
- Fetch missing history and merge
- Errors, token expiration, refreshing
