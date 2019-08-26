<?php
session_set_cookie_params(60*525600 ,"/");
session_start();
require_once('config.php');
$postdata = file_get_contents("php://input");


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
if(isset($_POST['session_id'])){

  $data['session_id'] = $_POST['session_id'];
}
$prefix = '';
$function = isset($_GET['function']) ? Helper::make_safe($_GET['function']) : null;
$valid = true;
$method = strtolower($_SERVER['REQUEST_METHOD']);
if ($request_headers['code'] == 1) {
  if (!empty($_SESSION[___APP]['session_key'])) {
    $session_key = $_SESSION[___APP]['session_key'] ? $_SESSION[___APP]['session_key'] : NULL;
    $session_roll = $_SESSION[___APP]['roll'] = 1;
  } else {
    $session_key = NULL;
    $session_roll = $_SESSION[___APP]['roll'] = 0;
  }

  if ($function) {
    if (!in_array($function, array('login', 'register', 'check_version' , 'add_feedback' , 'get_roll' , 'get_one_recognizes_researched' ,
      'search_paper' ,'is_user_exist', 'get_universities' , 'get_members' , 'get_published_papers' ,'send_email_reset_password', 'active_member' ,
      'get_countries' , 'get_disciplines' , 'statistics' , 'get_years' , 'get_member' , 'get_papers_by_member' , 'reset_password' ,
      'search_paper_by_member' , 'search_member'))) {
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
        case 'update_profile':
        {
          $result = User::update_Profile($data);
          break;
        }
        case 'get_member':
        {
          $result = User::get_member_by_id($data);
          break;
        }
        case 'edit_paper':
        {
          $result = User::edit_paper($data);
          break;
        }
        case 'send_email_reset_password':
        {
          $result = User::send_email_reset_password($data);
          break;
        }

        case 'reset_password':
        {
          $result = User::reset_password($data);
          break;
        }
        case 'get_member_logged_in':
        {
          $result = User::get_member_logged_in($data);
          break;
        }
        case 'statistics':
        {
          $result = User::get_statistics();
          break;
        }
        case 'get_members':
        {
          $result = User::get_active_members($data);
          break;
        }
        case 'active_member':
        {
          $result = User::active_member($data);
          break;
        }
        case 'save_paper':
        {
          $result = User::save_paper($data);
          break;
        }
        case 'unsave_paper':
        {
          $result = User::unsave_paper($data);
          break;
        }
        case 'get_papers':
        {
          $result = User::get_papers($data);
          break;
        }
        case 'get_paper':
        {
          $result = User::get_paper($data);
          break;
        }
        case 'get_published_papers':
        {
          $result = User::get_published_papers($data);
          break;
        }

        case 'add_view':
        {
          $result = User::add_view($data);
          break;
        }
        case 'add_download':
        {
          $result = User::add_download($data);
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
        case 'search_paper_by_member':
        {
          $result = User::search_paper_by_member($data);
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

        case 'get_countries':
        {
          $result = User::get_countries($data);
          break;
        }
        case 'get_years':
        {
          $result = User::get_years();
          break;
        }

        case 'get_tags':
        {
          $result = User::get_tags();
          break;
        }

        case 'get_disciplines':
        {
          $result = User::get_disciplines();
          break;
        }
        case 'is_user_exist':
        {
          $result = User::isUserExist($data);
          break;
        }

        case 'get_universities':
        {
          $result = User::get_universities();
          break;
        }


        case 'publish_unpublish_paper':
        {
          $result = User::publish_unpublish_paper($data);
          break;
        }
        case 'get_papers_by_member':
        {
          $result = User::get_papers_by_member($data);
          break;
        }
        case 'send_request_paper':
        {
          $result = User::send_request_paper($data);
          break;
        }
        case 'is_have_access':
        {
          $result = User::is_have_access($data);
          break;
        }
        case 'accept_request_paper':
        {
          $result = User::accept_request_paper($data);
          break;
        }
        case 'get_bookmarks':
        {
          $result = User::get_bookmarks($data);
          break;
        }
        case 'get_roll':
        {
          $result = $session_roll ;
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
