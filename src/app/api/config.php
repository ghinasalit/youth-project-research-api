<?php
define("APP_PATH", realpath(dirname(__FILE__) . '/..'));
define("APP_ROOT", "");
define("DEFAULT_LANGUAGES", "en");

$WEB_SERVICES_ROOT = APP_ROOT . 'api/';

require_once('libs/db/MysqliDb.php');
require_once('helpers/Config.php');
require_once('helpers/Helper.php');
require_once('helpers/Queries.php');
require_once('helpers/Enums.php');
require_once('helpers/TableFields.php');
require_once('helpers/Exceptions.php');
require_once('helpers/Validation.php');
require_once('helpers/ImageUpload.php');

require_once('tables/User.php');

