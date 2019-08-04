<?php

class TableFields
{
    static public function field_name($field)
    {
        switch ($field) {
            case 'username';
                return Helper::$lang['username'];
                break;
            case 'session_id':
                return Helper::$lang['session_id'];
                break;
            case 'password':
                return Helper::$lang['password'];
                break;
            case 'page':
                return Helper::$lang['page'];
                break;
            case 'size':
                return Helper::$lang['size'];
                break;
            case 'first_name':
                return Helper::$lang['first_name'];
                break;
            case 'last_name':
                return Helper::$lang['last_name'];
                break;
            case 'email\'':
                return Helper::$lang['email'];
                break;
            case 'phone':
                return Helper::$lang['phone'];
                break;
            case 'message':
                return Helper::$lang['message'];
                break;
                case 'name':
                return Helper::$lang['name'];
                break;



        }
    }
}
