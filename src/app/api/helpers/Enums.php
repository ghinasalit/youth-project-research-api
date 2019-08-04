<?php

namespace Model;

class Enums
{
    public static $code = array(
        "success" => 1,
        "empty_filed" => -2,
        "new_version" => -11,
        "user_blocked" => -14,
        "photo_not_found" => -15,
        "user_not_verified" => -16,
        "user_not_active" => -17,
        "already_verified" => -18,
        "user_not_found" => -19,

        "not_valid_code" => -20,
        "not_valid_email" => -21,
        "not_valid_date" => -22,
        "user_exist" => -23,
        "not_matched" => -24,
        "update_failed" => -25,
        "user_not_exist" => -26,
        "paper_not_exist" => -28,
        "file_not_image" => -27,
        "large_size" => -29,
        "uploaded_failed" => -32,

        "session_not_found" => -30,
        "session_expired" => -31,

        "no_more_data" => -45,
        "check_internet" => -46,

        "action_not_available" => -93,
        "no_language" => -94,
        "fail" => -95,
        "header_fail" => -96,
        "invalid_request" => -97,
        "not_found_api" => -98,
        "general_error" => -99,


    );

    public static $available_languages = array('ar' , 'en'    );
    public static $platforms = array('1');

}
