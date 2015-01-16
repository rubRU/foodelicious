# 0.1.2

## Feed
 * Feed is now returned in a hash
 * Corrected feed order
 * Added like feature on recipe (/recipes/:id/like)
 * Added recipe creation and like to feed
 * User now don't see his own posts (/user/feed)
 * Corrected user feed (/users/:id/feed)
 * Added test suite for actions
 * Corrected feed tests

# 0.1.1

## Feed
 * GET /user/:id/feed renamed to **/users/:id/feed** because it's more logical
 * POST /recipes/:id/comment renamed to **/recipes/:id/comments** because it's more logical

## Errors
 * Message from validation now returns summary of details object 
