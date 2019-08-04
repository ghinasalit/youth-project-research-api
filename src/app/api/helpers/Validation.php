<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 7/16/2018
 * Time: 10:37 AM
 */
class Validation
{
    public static function validate_page_size($data)
    {
        $errors = array();
        if (!isset($data['page']) && empty($data['page']) || is_null($data['page'])) {
            $errors[] = Exceptions::field_missing('page');
        }
        if (!isset($data['size']) || empty($data['size']) || is_null($data['size'])) {
            $errors[] = Exceptions::field_missing('size');
        }
        return empty($errors) ? null : $errors;
    }

    public static function validate_id($data)
    {
        $errors = array();
        if (!isset($data['id']) || empty($data['id']) || !is_null($data['id'])) {
            $errors[] = Exceptions::field_missing('id');
        }
        return empty($errors) ? null : $errors;
    }

    public static function validate_login($data)
    {
        $errors = array();
        if (!isset($data['username']) && empty($data['username']) || !static::is_null($data['username'])) {
            $errors[] = Exceptions::field_missing('username');
        }
        if (!isset($data['password']) && empty($data['password']) || !static::is_null($data['password'])) {
            $errors[] = Exceptions::field_missing('password');
        }
        return empty($errors) ? null : $errors;
    }

}