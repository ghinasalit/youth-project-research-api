<?php
session_start();
require_once('config.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Request-Method: POST");
header("Content-type:application/json");
header("Cache-Control: no-cache");
header("Content-Type: application/json");

$request_headers = Helper::check_header();
date_default_timezone_set("Asia/Damascus");
$result = array();

$json = file_get_contents('php://input');
$data = json_decode(Helper::objectToArray($json), true);

if (isset($_POST['session_id'])) {

    $data['session_id'] = $_POST['session_id'];
}
$prefix = '';
$function = isset($_GET['function']) ? Helper::make_safe($_GET['function']) : null;
$valid = true;
$method = strtolower($_SERVER['REQUEST_METHOD']);
if ($request_headers['code'] == 1) {
    if (!empty($_SESSION[___APP])) {
        $session_key = $_SESSION[___APP]['session_key'] ? $_SESSION[___APP]['session_key'] : NULL;
    } else {
        $session_key = NULL;
    }

    if ($function) {
        if (!in_array($function, array('login', 'register', 'check_version', 'add_feedback'))) {
            if ($session_key) {
                $valid = Queries::check_session_alive($session_key);
                if (!$valid) {
                    $result = Helper::response(\Model\Enums::$code['session_expired'], Exceptions::session_expired());
                } else {
                    $data['member_id'] = $valid;
                }
            } else {
                $result = Helper::response(\Model\Enums::$code['session_not_found'], Exceptions::session_not_found());
                $valid = false;
            }
        }

        if ($valid) {
            switch ($function) {
                case 'login':
                    {
                        $result = User::login($data);
                        break;
                    }
                case 'logout':
                    {
                        session_unset();
                        $result = '1';
                        break;
                    }
                case 'register':
                    {
                        $result = User::register($data);
                        break;
                    }
                case 'update_Profile':
                    {
                        $result = User::update_Profile($data);
                        break;
                    }
                case 'get_member':
                    {
                        $result = User::get_member_by_username($data);
                        break;
                    }
                case 'get_members':
                    {
                        $result = User::get_active_members($data);
                        break;
                    }
                case 'get_papers':
                    {
                        $result = User::get_papers($data);
                        break;
                    }

                case 'add_view':
                    {
                        $result = User::add_view($data);
                        break;
                    }
                case 'add_feedback':
                    {
                        $result = User::add_feedback($data);
                        break;
                    }
                case 'search_paper':
                    {
                        $result = User::search_paper($data);
                        break;
                    }
                case 'search_member':
                    {
                        $result = User::search_member($data);
                        break;
                    }
                case 'get_one_recognizes_researched':
                    {
                        $result = User::get_one_recognizes_researched($data);
                        break;
                    }
                case 'add_paper':
                    {
                        $result = User::add_paper($data);
                        break;
                    }

                case 'publish_unpublish_paper':
                    {
                        $result = User::publish_unpublish_paper($data);
                        break;
                    }
                default:
                    {
                        $result = Helper::response(\Model\Enums::$code['not_found_api'], Exceptions::not_found_api());
                        break;
                    }
            }
        }
    } else {
        $result = Helper::response(\Model\Enums::$code['invalid_request'], Exceptions::invalid_request());
    }

} elseif ($request_headers['code'] == -11) {
    $result = Helper::response(\Model\Enums::$code['new_version'], Exceptions::new_version(), $request_headers['data']);
} else {
    $result = Helper::response(\Model\Enums::$code['header_fail'], $request_headers['msg']);
}

echo json_encode($result);
exit;

?>
