<?php

namespace Model;
define("___APP", "Backend");
ini_set('session.gc_maxlifetime', 28800);


class Config
{
    public static $auth_key = '12345';
    public static $os_version;
    public static $platform;
    public static $mobile_brand;
    public static $app_version;

    public static $auth_fcm = '';

    public static $local_files = '../files/';
    public static $server_files = '../files/';

    public static $local_db = array(
        'db_server' => 'localhost',
        'db_user' => 'root',
        'db_pass' => '',
        'db_name' => 'arab_youth'
    );

    public static $live_db = array(
        'db_server' => 'http://asgc.webntech.ae/',
        'db_user' => 'ghina',
        'db_pass' => 'Qwaszx1234',
        'db_name' => 'arab_youth'
    );

    public static $image_config = array(
        'pic_width' => '1920',
        'pic_height' => '1920',
        'default_image_location' => 'images/',
        'size' => '5000000',
        'allowed' => array(
            'image/gif', 'image/jpeg', 'image/jpeg',
            'image/jpeg', 'image/png'
        )
    );
}

$DB = $FCM = $FILES_ROOT = "";

if (isset($_SERVER['HTTP_HOST']) && ($_SERVER['HTTP_HOST'] == "localhost")) {
    $DB = Config::$live_db;
    $FCM = Config::$auth_fcm;
    $FILES_ROOT = Config::$local_files;
}

$db = new \MysqliDb($DB['db_server'], $DB['db_user'], $DB['db_pass'], $DB['db_name']);
?>

