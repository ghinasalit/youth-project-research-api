<?php

/**
 * Syriatel Company
 * MIS Department
 * Created by PhpStorm.
 * User: AkramL
 * Date: 8/1/2018
 * Time: 1:36 PM
 */
Class User
{
    static public function login($data)
    {
        if (Helper::is_null($data['password'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('password'));
        } elseif (Helper::is_null($data['email'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('email'));
        } else {
            $email = Helper::make_safe($data['email']);
            $password = md5(Helper::make_safe($data['password']));
            $response = Queries::login($email, $password);
            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }
        }
        return $result;
    }

    static public function register($data)
    {
        if (Helper::is_null($data['password'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('password'));
        } elseif (Helper::is_null($data['username'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('username'));
        } elseif (Helper::is_null($data['first_name'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('first_name'));
        } elseif (Helper::is_null($data['last_name'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('last_name'));
        } elseif (Helper::is_null($data['email'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('email'));
        } else {
            $username = Helper::make_safe($data['username']);
            $password = Helper::make_safe($data['password']);
            $f_name = Helper::make_safe($data['first_name']);
            $l_name = Helper::make_safe($data['last_name']);
            $email = Helper::make_safe($data['email']);
            $avatar = Helper::make_safe($data['avatar']);
            $response = Queries::register($username, $password, $f_name, $l_name, $email, $avatar);
            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }
        }
        return $result;
    }


    static public function add_feedback($data)
    {
        if (Helper::is_null($data['name'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('name'));
        } elseif (Helper::is_null($data['email'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('email'));
        } elseif (Helper::is_null($data['message'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('message'));
        } elseif (Helper::is_null($data['phone'])) {
            $result = Helper::response(\Model\Enums::$code['empty_filed'], Exceptions::field_missing('phone'));

        } else {
            $name = Helper::make_safe($data['name']);
            $email = Helper::make_safe($data['email']);
            $message = Helper::make_safe($data['message']);
            $phone = Helper::make_safe($data['phone']);
            $response = Queries::add_feedback($name, $email, $phone, $message);
            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }
        }
        return $result;
    }


    static public function update_Profile($data)
    {

        $avatar = '';
        $location = Helper::make_safe($_POST['location']);
        $member_id = Helper::make_safe($data['member_id']);
        $university = Helper::make_safe($_POST['university']);
        $phone = Helper::make_safe($_POST['phone']);
        $domain = Helper::make_safe($_POST['domain']);
        $description = Helper::make_safe($_POST['description']);
        if ($_FILES['file']) {
            $avatar = FileUpload::upload_image($data);
        }
        if (!is_numeric($avatar)) {
            $response = Queries::updateProfile($member_id ,$location, $university, $phone, $domain, $description, $avatar);
            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }

        } else {
            $error_msg = array_search($avatar, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        }

        return $result;
    }


 static public function  publish_unpublish_paper($data)
    {


        $status = Helper::make_safe($data['status']);
        $paper_id= Helper::make_safe($data['paper_id']);


            $response = Queries::publish_unpublish_paper($paper_id ,$status);
            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }

        return $result;
    }


    static public function add_paper($data)
    {

        $paper = '';
        $title = Helper::make_safe($_POST['title']);
        $member_id = Helper::make_safe($data['member_id']);
        $status = Helper::make_safe($_POST['status']);
        $tag = Helper::make_safe($_POST['tag']);
        $discipline = Helper::make_safe($_POST['discipline']);
        $description = Helper::make_safe($_POST['description']);
        $permission = Helper::make_safe($_POST['permission']);
        $language = Helper::make_safe($_POST['language']);
        if ($_FILES['file']) {
            $paper = FileUpload::upload_file($data);
        }
        if (!is_numeric($paper)) {
            $response = Queries::add_paper($member_id ,$title,$description , $status, $tag, $discipline, $permission , $language , $paper);
            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }

        } else {
            $error_msg = array_search($paper, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        }

        return $result;
    }


    static public function search_paper($data)
    {
        $keyword = Helper::make_safe($data['keyword']);
        $country = Helper::make_safe($data['country']);
        $discipline = Helper::make_safe($data['discipline']);
        $year = Helper::make_safe($data['year']);
        $lang = Helper::make_safe($data['lang']);
        $page = Helper::make_safe($data['page']);
        $size = Helper::make_safe($data['size']);
        $response = Queries::search_paper($page, $size, $country, $discipline, $year, $lang, $keyword);
        if (is_numeric($response)) {
            $error_msg = array_search($response, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        } else {
            $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
        }

        return $result;
    }


    static public function search_member($data)
    {
        $keyword = Helper::make_safe($data['keyword']);
        $letter = Helper::make_safe($data['letter']);
        $page = Helper::make_safe($data['page']);
        $size = Helper::make_safe($data['size']);
        $response = Queries::search_member($page, $size, $letter, $keyword);
        if (is_numeric($response)) {
            $error_msg = array_search($response, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        } else {
            $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
        }

        return $result;
    }

    static public function get_one_recognizes_researched($data)
    {
        $country = Helper::make_safe($data['country']);

        $response = Queries::get_one_recognizes_researched($country);
        if (is_numeric($response)) {
            $error_msg = array_search($response, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        } else {
            $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
        }

        return $result;
    }


    static public function get_member_by_username($data)
    {
        $username = Helper::make_safe($data['username']);

        $response = Queries::get_member_by_username($username);
        if (is_numeric($response)) {
            $error_msg = array_search($response, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        } else {
            $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
        }

        return $result;


    }


    static public function add_view($data)
    {
        $paper_id = Helper::make_safe($data['paper_id']);
        $user_id = Helper::make_safe($data['user_id']);

        $response = Queries::add_view($paper_id, $user_id);
        if (is_numeric($response)) {
            $error_msg = array_search($response, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        } else {
            $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
        }

        return $result;


    }

    static public function get_active_members($data)
    {

        if (is_null(Validation::validate_page_size($data))) {
            $page = $data['page'];
            $size = $data['size'];

            $response = Queries::get_active_members($page, $size);

            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }
            return $result;
        } else {
            return Validation::validate_page_size($data);
        }
    }


    static public function get_papers($data)
    {

        if (is_null(Validation::validate_page_size($data))) {
            $page = $data['page'];
            $size = $data['size'];

            $response = Queries::get_papers($page, $size);

            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }
            return $result;
        } else {
            return Validation::validate_page_size($data);
        }
    }

    static public function get_published_papers($data)
    {

        if (is_null(Validation::validate_page_size($data))) {
            $page = $data['page'];
            $size = $data['size'];

            $response = Queries::get_published_papers($page, $size);

            if (is_numeric($response)) {
                $error_msg = array_search($response, \Model\Enums::$code);
                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
            } else {
                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
            }
            return $result;
        } else {
            return Validation::validate_page_size($data);
        }
    }


    static public function get_users()
    {
        $response = Queries::get_users();
        if (is_numeric($response)) {
            $error_msg = array_search($response, \Model\Enums::$code);
            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
        } else {
            $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
        }

        return $result;
    }


    static public function upload_profile_pic($data)
    {
//        $member_id = Helper::make_safe($data['member_id']);

        $avatar = ImageUpload::upload_image($data);
//        if (!is_numeric($avatar)) {
//            $response = Queries::upload_profile_pic($member_id, $avatar);
//            if (is_numeric($response)) {
//                $error_msg = array_search($response, \Model\Enums::$code);
//                $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
//            } else {
//                $result = Helper::response(\Model\Enums::$code['success'], Exceptions::success(), $response);
//            }
//            return $result;
//        }else{
//            $error_msg = array_search($avatar, \Model\Enums::$code);
//            $result = Helper::response(\Model\Enums::$code[$error_msg], Exceptions::$error_msg());
//        }
    }
}

?>
