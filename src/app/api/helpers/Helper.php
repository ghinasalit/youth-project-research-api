<?php

class Helper
{
    public static $lang;
    public static $lang_code;
    public static $ip = '';
    public static $browser_info = '';

    static public function make_safe_array($data, $except = array())
    {
        $new_array = array();
        foreach ($data as $key => $value) {
            if (in_array($key, $except)) {
                $new_array[$key] = $value;
                continue;
            }
            $new_array[$key] = self::make_safe($value);
        }
        return $new_array;
    }

    static public function make_safe($data)
    {
        if (is_array($data)) return $data;
        $data = addslashes($data);
        return $data;
    }

    static public function objectToArray($object)
    {
        if (is_object($object)) {
            $object = get_object_vars($object);
        }
        if (is_array($object)) {
            return array_map(__FUNCTION__, $object);
        } else {
            return $object;
        }
    }

    static public function unmake_safe_array($data)
    {
        $new_array = array();
        foreach ($data as $key => $value) {
            $new_array[$key] = $value;
        }
        $new_array[$key] = stripcslashes($value);
        return $data;
    }

    static public function guid()
    {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        }
        return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }

    public static function check_header()
    {

        GLOBAL $headers;
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        $ip = self::get_client_ip();
        $result = array();
        static::$ip = $ip;
        $headers['Authorization'] = '12345';
        if (isset($headers['Authorization'])) {

            if ($headers['Authorization'] == \Model\Config::$auth_key) {
                if (isset($headers['Accept-Language'])) {
                    if (in_array($headers['Accept-Language'], \Model\Enums::$available_languages)) {
                        self::$lang_code = $language = $headers['Accept-Language'];
                        require_once('lang/' . $language . '.php');
                        self::$lang = $lang;
                        if (isset($headers['Platform'])) {
                            if (in_array($headers['Platform'], \Model\Enums::$platforms)) {
                                \Model\Config::$platform = $headers['Platform'];
                                if (isset($headers['Os-Version'])) {
                                    \Model\Config::$os_version = $headers['Os-Version'];
                                    if (isset($headers['Mobile-Brand'])) {
                                        \Model\Config::$mobile_brand = $headers['Mobile-Brand'];
                                        if (isset($headers['App-Version'])) {
                                            \Model\Config::$app_version = $headers['App-Version'];
                                            $version = Queries::check_version_header(\Model\Config::$app_version);
                                            if (!$version['required'] === true) {
                                                $result['code'] = 1;
                                                $result['msg'] = 'Success';
                                            } else {
                                                $result['code'] = -11;
                                                $result['data'] = $version;
                                            }
                                        } else {
                                            $result['code'] = -9;
                                            $result['msg'] = 'Please Insert App Version Parameter';
                                        }
                                    } else {
                                        $result['code'] = -9;
                                        $result['msg'] = 'Please Insert Mobile Brand Version Parameter';
                                    }
                                } else {
                                    $result['code'] = -9;
                                    $result['msg'] = 'Please Insert OS Version Parameter';
                                }
                            } else {
                                $result['code'] = -9;
                                $result['msg'] = 'Platform Parameter Not Valid';
                            }
                        } else {
                            $result['code'] = -9;
                            $result['msg'] = 'Please Insert Platform Parameter';
                        }
                    } else {
                        $result['code'] = -9;
                        $result['msg'] = 'Language Is Not Valid';
                    }
                } else {
                    $result['code'] = -9;
                    $result['msg'] = 'Please Insert Language Parameter';
                }
            } else {
                $result['code'] = -9;
                $result['msg'] = 'Authorization Key Not Valid';
            }
        } else {
            $result['code'] = -9;
            $result['msg'] = 'Please Insert Authorization Parameter';
        }
        return $result;
    }

    static public function get_client_ip()
    {
        $ip_address = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ip_address = getenv('HTTP_CLIENT_IP');
        else if (getenv('HTTP_X_FORWARDED_FOR'))
            $ip_address = getenv('HTTP_X_FORWARDED_FOR');
        else if (getenv('HTTP_X_FORWARDED'))
            $ip_address = getenv('HTTP_X_FORWARDED');
        else if (getenv('HTTP_FORWARDED_FOR'))
            $ip_address = getenv('HTTP_FORWARDED_FOR');
        else if (getenv('HTTP_FORWARDED'))
            $ip_address = getenv('HTTP_FORWARDED');
        else if (getenv('REMOTE_ADDR'))
            $ip_address = getenv('REMOTE_ADDR');
        else
            $ip_address = 'UNKNOWN';
        return $ip_address;

    }

    public static function is_null($field)
    {
        if (strlen($field) === 0) {
            return true;
        }
        return false;
    }

    static public function response($code, $msg, $data = null, $query = null)
    {
        $response['code'] = $code;
        $response['msg'] = $msg;
        $response['data'] = $data;
        if (isset($query) && !empty($query)) {
            $response['query'] = $query;
        }
        return $response;
    }

}

?>
