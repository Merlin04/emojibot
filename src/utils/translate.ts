export function humanizeSlackError(error: { ok: boolean; error?: string }) {
    if (!error.error) return "Unknown error";
    //    make a switch statement for the error codes
    switch (error.error) {
        case "emoji_not_found":
            return "We could not find the emoji you tried to remove";
        case "failure_removing_emoji":
            return "This emoji could not be removed. It might be part of the standard Unicode set or the default Slack package";
        case "emoji_limit_reached":
            return "You have reached the emoji limit";
        case "error_bad_format":
            return "Invalid image data was provided";
        case "error_bad_name_i18n":
            return "Value passed for name was invalid. Please make sure the name is a valid emoji name.";
        case "error_bad_upload":
            return "There was an error uploading the image";
        case "error_bad_wide":
            return "The image width or height is too large";
        case "error_missing_name":
            return "Value passed for name is missing or empty; this should never happen plz ping the devs for emojibot";
        case "error_name_taken":
            return "Someone else already added this emoji";
        case "error_name_taken_i18n":
            return "Someone else already added this emoji (i18n)";
        case "error_no_image":
            return "No image data was provided";
        case "error_too_big":
            return "The image file size is too large; try a smaller image?";
        case "failed_to_add_emoji":
            return "Failed to add the specified emoji; we don't really know why";
        case "failed_to_fetch_active_team":
            return "There are no active teams on the org and we need at least one";
        case "feature_not_enabled":
            return "The Admin APIs feature is not enabled for this team";
        case "no_image_uploaded":
            return "No image data was provided; this should never happen plz ping the devs for emojibot";
        case "not_an_admin":
            return "This method is only accessible by org owners and Admins; someone messed up the permissions of the emojibot slack acount";
        case "ratelimited":
            return "The request has been ratelimited. Wait a bit and try again";
        case "resized_but_still_too_large":
            return "The image is still too large after resizing; try a smaller image?";
        case "too_many_frames":
            return "The image has too many frames; are you sure you're not trying to upload a gif version of star wars?";
        case "access_denied":
            return "Access to a resource specified in the request is denied (this should never happen plz ping the devs for emojibot)";
        case "account_inactive":
            return "Authentication token is for a deleted user or workspace when using a bot token; (who deleted the bot? this should never happen plz ping the devs for emojibot)";
        case "deprecated_endpoint":
            return "The endpoint has been deprecated (this should never happen plz ping the devs for emojibot)";
        case "ekm_access_denied":
            return "Administrators have suspended the ability to post a message (this should never happen plz ping the devs for emojibot)";
        case "enterprise_is_restricted":
            return "The method cannot be called from an Enterprise; (stop being mean slack ;_;)";
        case "invalid_auth":
            return "Some aspect of authentication cannot be validated. Either the provided token is invalid or the request originates from an IP address disallowed from making the request; (e.g someone is trying to use the bot from a VPN or something)";
        case "is_bot":
            return "This method cannot be called by a legacy bot; (who set this up? this should never happen plz ping the devs for emojibot)";
        case "method_deprecated":
            return "The method has been deprecated (you gotta be kidding me)";
        case "missing_scope":
            return "The token used is not granted the specific scope permissions required to complete this request (you sure you followed the instructions?)";
        case "not_allowed_token_type":
            return "The token type used in this request is not allowed (you sure you followed the instructions? this should be a real user's token)";
        case "not_authed":
            return "No authentication token provided; (sommething is very wrong with the bot's token or your ability to set up the bot)";
        case "no_permission":
            return "The workspace token used in this request does not have the permissions necessary to complete the request. Make sure your app is a member of the conversation it's attempting to post a message to; huh? this should never happen plz ping the devs for emojibot";
        case "org_login_required":
            return "The workspace is undergoing an enterprise migration and will not be available until migration is complete; (do exactly what the instructions say, wait ...)";
        case "token_expired":
            return "Authentication token has expired; (you know what to do; ping the devs for emojibot)";
        case "token_revoked":
            return "Authentication token is for a deleted user or workspace or the app has been removed when using a user token; (who deleted the bot? someone's going to get it)";
        case "two_factor_setup_required":
            return "Two factor setup is required (you sure you followed the instructions?)";
        case "accesslimited":
            return "Access to this method is limited on the current networkl; (wait a bit and retry)";
        case "fatal_error":
            return "The server could not complete your operation(s) without encountering a catastrophic error. It's possible some aspect of the operation succeeded before the error was raised; (ooh you managed to break slacks internal servers!)";
        case "internal_error":
            return "The server could not complete your operation(s) without encountering an error, likely due to a transient issue on our end. It's possible some aspect of the operation succeeded before the error was raised; (ooh you managed to break slacks internal servers partialy; maybe try again later?)";
        case "invalid_arg_name":
            return "The method was passed an argument whose name falls outside the bounds of accepted or expected values. This includes very long names and names with non-alphanumeric characters other than _. If you get this error, it is typically an indication that you have made a very malformed API call; (pov you forgot to fix the api call in dev :skull:)";
        case "invalid_arguments":
            return "The method was either called with invalid arguments or some detail about the arguments passed is invalid, which is more likely when using complex arguments like blocks or attachments; (huh? that definetly shouldn't happen plz ping the devs for emojibot)";
        case "invalid_array_arg":
            return "The method was passed an array as an argument. Please only input valid strings; (come on you're not helping me; who stuck an array in here?)";
        case "invalid_charset":
            return "The method was called via a POST request, but the charset specified in the Content-Type header was invalid. Valid charset names are: utf-8 iso-8859-1 (this should never happen plz ping the devs for emojibot)";
        case "invalid_form_data":
            return "The method was called via a POST request with Content-Type application/x-www-form-urlencoded or multipart/form-data, but the form data was either missing or syntactically invalid (this should never happen plz ping the devs for emojibot)";
        case "invalid_post_type":
            return "The method was called via a POST request, but the specified Content-Type was invalid. Valid types are: application/json application/x-www-form-urlencoded multipart/form-data text/plain (this should never happen plz ping the devs for emojibot)";
        case "missing_post_type":
            return "The method was called via a POST request and included a data payload, but the request did not include a Content-Type header (this should never happen plz ping the devs for emojibot)";
        case "request_timeout":
            return "The method was called via a POST request, but the POST data was either missing or truncated (this should never happen plz ping the devs for emojibot)";
        case "service_unavailable":
            return "The service is temporarily unavailable";
        case "team_added_to_org":
            return "The workspace associated with your request is currently undergoing migration to an Enterprise Organization. Web API and other platform operations will be intermittently unavailable until the transition is complete";
    }
}
