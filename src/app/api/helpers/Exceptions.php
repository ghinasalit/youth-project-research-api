<?php

class Exceptions
{
    public static $result;

    public static function success()
    {
        return Helper::$lang['success'];
    }

    public static function field_missing($field_name)
    {
        return Helper::$lang['enter_field'] . " " . TableFields::field_name($field_name) . " " . Helper::$lang['enter_field_after'];
    }

    public static function user_not_verified()
    {
        return Helper::$lang['account_not_verified'];

    }

    public static function user_not_active()
    {
        return Helper::$lang['account_not_active'];

    }

    public static function general_error()
    {
        return Helper::$lang['general_error'];
    }

    public static function not_valid_code()
    {
        return Helper::$lang['not_valid_code'];
    }

    public static function not_valid_email()
    {
        return Helper::$lang['not_valid_email'];
    }

    public static function not_valid_date()
    {
        return Helper::$lang['not_valid_date'];
    }

    public static function user_not_found()
    {
        return Helper::$lang['user_not_found'];
    }

    public static function user_blocked()
    {
        return Helper::$lang['user_blocked'];
    }

    public static function session_not_found()
    {
        return Helper::$lang['session_not_found'];
    }

    public static function session_expired()
    {
        return Helper::$lang['session_expired'];
    }

    public static function already_verified()
    {
        return Helper::$lang['already_verified'];
    }

    public static function not_found_api()
    {
        return Helper::$lang['not_found_api'];
    }

    public static function invalid_request()
    {
        return Helper::$lang['invalid_request'];
    }

    public static function action_not_available()
    {
        return Helper::$lang['action_not_available'];
    }

    public static function no_data_found()
    {
        return Helper::$lang['no_data_found'];
    }

    public static function new_version()
    {
        return Helper::$lang['new_version'];
    }

    public static function user_exist()
    {
        return Helper::$lang['user_exist'];
    }

    public static function already_viewed()
    {
        return Helper::$lang['already_viewed'];
    }

    public static function paper_not_exist()
    {
        return Helper::$lang['paper_not_exist'];
    }

    public static function user_not_exist()
    {
        return Helper::$lang['user_not_exist'];
    }

    public static function file_not_image()
    {
        return Helper::$lang['file_not_image'];
    }

    public static function large_size()
    {
        return Helper::$lang['large_size'];
    }

    public static function uploaded_failed()
    {
        return Helper::$lang['uploaded_failed'];
    }

    public static function not_matched()
    {
        return Helper::$lang['not_matched'];
    }

    public static function update_failed()
    {
        return Helper::$lang['update_failed'];
    }

    public static function no_more_data()
    {
        return Helper::$lang['no_more_data'];
    }

    public static function check_internet()
    {
        return Helper::$lang['check_internet'];
    }

}
