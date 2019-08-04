<?php

//session_start();
class Queries
{
    static public function login($email, $password)
    {
        global $db;

        $data = Array(
            'session_id' => md5(microtime()));


        $db->where('email', $email);
        $db->where('password', $password);
        $db->update('members', $data);
        $user = $db->where('email', $email)
            ->where('password', $password)
            ->getOne("members", ' member_id , username ');
        if ($db->count) {

            $_SESSION[___APP]['session_key'] = $data['session_id'];
            return $user;

        } else {
            return -24;
        }
    }


    static public function updateProfile($member_id, $location, $university, $phone, $domain, $description, $avatar)
    {

        global $db;
        $data = Array(
            'location' => $location,
            'university_id' => $university,
            'phone' => $phone,
            'domain' => $domain,
            'description' => $description,
            'avatar' => $avatar,
        );

        $db->where('member_id', $member_id);
        $db->update('members', $data);
        $user = $db->where('member_id', $member_id)
            ->get("members", null, 'username , location , university_id , phone , description , domain , avatar');
        if ($db->count) {
            return $user;
        } else {
            return -25;
        }
    }

    static public function add_paper($member_id, $title, $description, $status, $tag, $discipline, $permission, $language, $paper)
    {

        global $db;
        $data = Array(
            'title' => $title,
            'status' => $status,
            'tags' => $tag,
            'discipline' => $discipline,
            'permission' => $permission,
            'description' => $description,
            'language' => $language,
            'member_id' => $member_id,
            'file' => $paper,
        );

        $paper_id = $db->insert('papers', $data);
        $user = $db->where('paper_id', $paper_id)->getOne('papers', 'title, description , status, tags, discipline, permission , language , file');

        if ($db->count) {
            return $user;
        } else {
            return -25;
        }
    }

    static public function publish_unpublish_paper($paper_id, $status)
    {

        global $db;
        $data = Array(
            'status' => $status,
        );

        $db->where('paper_id', $paper_id);
        $db->update('papers', $data);
        $paper = $db->where('paper_id', $paper_id)
            ->get("papers", null, 'paper_id , status');
        if ($db->count) {
            return $paper;
        } else {
            return -25;
        }
    }

    static public function active_unactive_member($user_id, $status)
    {

        global $db;
        $data = Array(
            'active' => $status,
        );

        $db->where('member_id', $user_id);
        $db->update('members', $data);
        $paper = $db->where('member_id', $user_id)
            ->get("members", null, 'member_id , active');
        if ($db->count) {
            return $paper;
        } else {
            return -25;
        }
    }

    static public function register($username, $password, $f_name, $l_name, $email, $avatar)
    {
        global $db;
        $avatar_random_name = uniqid();
        $pos = strpos($avatar, ';');
        $ext = explode(':image/', substr($avatar, 0, $pos))[1];
        if (!empty($avatar)) {
            $avatar_path = $avatar_random_name . '.' . $ext;
        } else {
            $avatar_path = '';
        }

        $data = Array(
            'first_name' => $f_name,
            'last_name' => $l_name,
            'avatar' => $avatar_path,
            'username' => $username,
            'session_id' => md5(microtime()),
            'email' => $email,
            'password' => md5($password),
            'active' => '1',
        );


        $userCheck = $db->where("username", $username)->get("members");
        if (!$userCheck) {
            Helper::saveToFile($avatar, $avatar_random_name, $ext);
            $db->insert('members', $data);
            $user = $db->where('username', $username)->getOne('members', 'username');
            if ($db->count) {
                return $user;
            } else {
                return -95;
            }
        } else {
            return -23;
        }
    }

    static public function add_feedback($name, $email, $phone, $message)
    {
        global $db;
        $data = Array(
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message,

        );
        $db->insert('feedback', $data);
        if ($db->count) {
            return $data;
        } else {
            return -95;
        }

    }

    static public function get_member_by_username($username)
    {
        global $db;

        $member = $db->where('username', $username)
            ->getOne("members", 'member_id , first_name , last_name , email , username  , phone , location , university_id , domain , description ');

        if ($member) {
            $count_papers = Queries::get_count_papers_for_member($member['member_id']);
            $views = Queries::get_all_views_for_member($member['member_id']);
            $member['views'] = $views[0]['views'];
            $member['count_papers'] = $count_papers[0]['views'];
            return $member;
        } else {
            return -26; // member don't found
        }
    }

    static public function get_active_members($page, $size)
    {
        global $db;
        $db->pageLimit = $size;
        $members = $db->where('active', 1)
            ->arraybuilder()->paginate("members", $page);
        if (!empty($members)) {
            if ($db->count) {
                return $members;
            } else {
                return -99;

            }
        } else {
            return [];
        }
    }

    static public function get_papers($page, $size)
    {
        global $db;
        $db->pageLimit = $size;
        $papers = $db->arraybuilder()->paginate("papers", $page);
        if (!empty($papers)) {
            if ($db->count) {
                return $papers;
            } else {
                return -99;


            }
        } else {
            return [];
        }
    }

    static public function add_view($paper_id, $member_id)
    {

        global $db;

        $owner_paper = $db->where('member_id', $member_id)
            ->where('paper_id', $paper_id)
            ->get("papers", null, 'member_id ');

        if (!$db->count) { // if viewer is not the owner
            $view = $db->where('member_id', $member_id)
                ->where('paper_id', $paper_id)
                ->get("viewers", null, 'id ');

            if (!$db->count) { // if the viewer dont visit paper before
                $data = Array(
                    'member_id' => $member_id,
                    'paper_id' => $paper_id
                );
                // get count  views and added one
                $db->insert('viewers', $data);
                $views = $db->where('paper_id', $paper_id)
                    ->get("papers", null, 'views ');
                $views = intval($views[0]['views']) + 1;
                $data = Array(
                    'views' => $views,
                );

                // update views count
                $db->where('paper_id', $paper_id);
                $db->update('papers', $data);
                if ($db->count) {
                    return $data;
                } else {
                    return -95;
                }
            } else {
            }
        }
    }

    static public function get_count_papers_for_member($member_id)
    {
        global $db;

        $member = $db->where('member_id', $member_id)
            ->operation("papers", null, 'COUNT', 'member_id', 'views');

        if ($member) {
            return $member;
        } else {
            return -99; // member don't active
        }
    }

    static public function get_all_views_for_member($member_id)
    {
        global $db;

        $member = $db->where('member_id', $member_id)
            ->operation("papers", null, 'SUM', 'views', 'views');
        if ($member) {
            return $member;
        } else {
            return -99; // member don't active
        }
    }

    static public function get_published_papers($page, $size)
    {

        // page start from 1
        global $db;
        $db->pageLimit = $size;
        $papers = $db->where('status', 1)
            ->arraybuilder()->paginate("papers", $page);
        if (!empty($papers)) {
            if ($db->count) {
                return $papers;
            } else {
                return -99;

            }
        } else {
            return [];
        }
    }

    static public function search_paper($page, $size, $country, $discipline, $year, $lang, $keyword)
    {

        // page start from 0
        global $db;
        $page *= $size;
        $data = Array(
            'university.country_id' => $country,
            'papers.discipline' => $discipline,
            'papers.date' => $year,
            'papers.language' => $lang,
        );

        $keywords = Array(
            'papers.description' => $keyword,
            'papers.title' => $keyword,
            'papers.discipline' => $keyword,
        );
        $q = "SELECT * FROM  papers JOIN university ON university.university_id = papers.university_id WHERE  papers.status = 1  AND (1=1 ";
        foreach ($data as $key => $item) {
            if (!empty($item)) {
                $q .= " AND " . $key . " LIKE " . "'%" . $item . "%' ";
            }
        }
        $q .= ")";

        if (!empty($keyword)) {

            $q .= "AND(1=2";
            foreach ($keywords as $key => $item) {
                $q .= " OR " . $key . " LIKE " . "'%" . $item . "%' ";
            }
            $q .= ")";

        }
        $q_with_paging = $q . " LIMIT {$page} , {$size}";
        $papers = $db->withTotalCount()->rawQuery($q_with_paging);
        if (!empty($papers)) {
            if ($db->count) {
                return $papers;
            } else {
                return -99;
            }
        } else {
            return [];
        }
    }

    static public function search_member($page, $size, $letter, $keyword)
    {

        // page start from 0
        global $db;
        $page *= $size;
        $data = Array(
            'first_name' => $keyword,
            'last_name' => $keyword,
        );
        $q = "SELECT * FROM  members  WHERE members.active = 1  AND (1=2 ";
        foreach ($data as $key => $item) {
            if (!empty($item)) {
                $q .= " OR " . $key . " LIKE  " . "'%" . $item . "%' ";
            }
        }
        $q .= ")";
        if (!empty($letter)) {
            $q .= " AND first_name LIKE '" . $letter . "%' ";
        };
        $q_with_paging = $q . " LIMIT {$page} , {$size}";

        $papers = $db->withTotalCount()->rawQuery($q_with_paging);
        if (!empty($papers)) {
            if ($db->count) {
                return $papers;
            } else {
                return -99;

            }
        } else {
            return [];
        }
    }

    static public function get_paper_by_id($paper_id)
    {
        global $db;
        $paper = $db->where('paper_id', $paper_id)
            ->get("members", null, ' status , title , description , tags , discipline , permission , date , permission');
        if ($paper) {
            return $paper;
        } else {
            return -28; //paper not exist
        }
    }

    static public function get_one_recognizes_researched($country)
    {
        global $db;
        $query = " SELECT MAX(views) as views, country,  member_id FROM 
(SELECT SUM(views)as views  ,country.country_id as country_id , country.name_en as country , papers.member_id as member_id FROM papers 
                    INNER JOIN members 
                   ON papers.member_id =  members.member_id 
                    INNER JOIN university
                    ON university.university_id =  members.university_id
                    INNER JOIN country
                    ON country.country_id =  university.country_id
                    GROUP BY papers.member_id  HAVING country.name_en  LIKE '%" . $country . "%'  ORDER BY views desc )  AS t1";

        $papers = $db->withTotalCount()->rawQuery($query);
        if ($papers[0]['views'] == null) {
            return [];
        }
        if ($papers) {
            return $papers;
        } else {
            return -99; // member don't active
        }
    }

    static public function upload_profile_pic($member_id, $avatar)
    {
        global $db;
        $data = Array('avatar' => $avatar);
        $users = $db->where('member_id', $member_id)->update('members', $data);

        if ($db->count) {
            return $users;
        } else {
            return -46;
        }

    }

    static public function upload_paper($paper_id, $paper)
    {
        global $db;
        $data = Array('file' => $paper);
        $users = $db->where('paper_id', $paper_id)->update('papers', $data);

        if ($db->count) {
            return $users;
        } else {
            return -46;
        }

    }

    public static function check_session_alive($session)
    {
        global $db;

        $db->where("session_id", $session);
        $user_id = $db->getValue("members", "member_id");
        if ($db->count) {
            return $user_id;
        } else {
            return false;
        }
    }


    static public function check_version_header($version)
    {
        return true;
    }
}


?>
