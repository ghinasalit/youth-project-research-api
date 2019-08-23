<?php

class Queries
{
    static public function login($email, $password)
    {
        global $db;

        $data = Array(
            'session_id' => md5(microtime()));



        $user = $db->where('email', $email)
            ->where('password', $password)
            ->getOne("members", ' member_id , username , active ');
        if ($db->count) {
            if($user['active'] == 1){
                $db->where('email', $email);
                $db->where('password', $password);
                $db->update('members', $data);
                $_SESSION[___APP]['session_key'] = $data['session_id'];
                return $user;

            }else{

                return -99; // not active yet
            }

        } else {
            return -24;
        }
    }


    static public function add_paper($member_id, $title, $description, $status, $tags, $discipline, $permission, $language, $paper)
    {
        global $db;
        $data = Array(
            'title' => $title,
            'status' => $status,
            'discipline_id' => $discipline,
            'permission' => $permission,
            'description' => $description,
            'language' => $language,
            'member_id' => $member_id,
            'date' => date("Y-m-d"),
            'file' => $paper,
        );


        $paper_id = $db->insert('papers', $data);
        $tags = explode(',', $tags[0]);
        foreach ($tags as $value) {
            $data = Array(
                'tag_id' => $value,
                'paper_id' => $paper_id,
            );
            $db->insert('paper_tags', $data);
        }
        $paper = $db->where('paper_id', $paper_id)->getOne('papers', 'paper_id', 'title, description , status, discipline_id, permission , language , file');


        if ($db->count) {
            Queries::send_email_publish_paper($paper['paper_id'], $member_id);
            return $paper;
        } else {
            return -25;
        }
    }

    static public function send_email_publish_paper($paper_id, $member_id)
    {
        global $db;

        $member_from = $db->where('member_id', $member_id)
            ->getOne('members', 'email');
        $member_to = $db->where('user_id', 1)
            ->getOne('users', 'email');


        if ($member_to['email'] && $member_from['email']) {

            $to = $member_to['email'];
//            $to = 'ghinasallit@gmail.com';
            $subject = "Arab Youth Research/publish paper";

            $body = "
<html>
<head>
<title></title>
</head>
<body>
<p>Dear,</p>
<p> We need your kind support to confirm publish my paper</p>
<table>
<tr>
<a href=http://admin.arabyouthresearch.org/#/paper/" . $paper_id . ">Click here to preview paper </a>
</tr>
</table>
</body>
<table>
</html>
";

// Always set content-type when sending HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
            $headers .= 'From:' . $member_from['email'] . "\r\n";

            mail($to, $subject, $body, $headers);
        }
    }


    static public function reset_password($activation_code, $password)
    {


        global $db;
        $data = Array(
            'password' => md5($password),
            'activation_code' => '',
        );

        $user = $db->where('activation_code', $activation_code)
            ->getOne('members', 'email');
        if ($user) {
            $user = $db->where('activation_code', $activation_code)
                ->update('members', $data);


            return $user;

        } else {
            return -99;
        }

    }

    static public function send_email_reset_password($email)
    {

        global $db;
        $data = Array(
            'activation_code' => md5(microtime()),

        );
        $userCheck = $db->where("email", $email)->get("members");
        if ($userCheck) {
            $db->where('email', $email)
                ->update('members', $data);


//            $to = $email;
            $to = 'ghinasallit@gmail.com';
            $subject = "Reset password";

            $body = "
<html>
<head>
<title></title>
</head>
<body>
<p>Dear,</p>
<table>
<tr>
<a href=http://admin.arabyouthresearch.org/#/reset-password/" . $data['activation_code'] . ">Click here to reset password </a>
</tr>
</table>
</body>
<table>
</html>
";

// Always set content-type when sending HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
            $headers .= 'From:info@arabyouthresearch.org' . "\r\n";

            mail($to, $subject, $body, $headers);


        } else {
            return -26;
        }

    }


    static public function edit_paper($paper_id, $title, $description, $tags, $discipline, $language)
    {

        global $db;
        $data = Array(
            'title' => $title,
            'discipline_id' => $discipline,
            'description' => $description,
            'language' => $language,
        );

        $db->where('paper_id', $paper_id);
        $db->update('papers', $data);

        foreach ($tags as $value) {
            $db->where('paper_id', $paper_id)
                ->delete('paper_tags');

        }

        foreach ($tags as $value) {
            $data = Array(
                'tag_id' => $value,
                'paper_id' => $paper_id,
            );

            $db->insert('paper_tags', $data);

        }


        $paper = $db->where('paper_id', $paper_id)->getOne('papers', 'title, description , discipline_id, permission , language');

        if ($db->count) {
            return $paper;
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


    static public function register($password, $f_name, $l_name, $email, $avatar, $university, $job, $location, $phone, $Linkedin, $description)
    {
        global $db;


        if (!empty($avatar)) {
            $avatar_random_name = uniqid();
            $pos = strpos($avatar, ';');

            $ext = explode(':image/', substr($avatar, 0, $pos))[1];
            $avatar_path = $avatar_random_name . '.' . $ext;
        } else {
            $avatar_path = '';
        }
        global $db;


        $data = Array(
            'first_name' => $f_name,
            'last_name' => $l_name,
            'avatar' => $avatar_path,
            'university_id' => $university,
            'domain' => $job,
            'location' => $location,
            'phone' => $phone,
            'Linkedin' => $Linkedin,
            'description' => $description,
            'session_id' => md5(microtime()),
            'email' => $email,
            'username' => $email,
            'password' => md5($password),
            'active' => '0',
            'activation_code' => md5($password),

        );

        $userCheck = $db->where("email", $email)->get("members");
        if (!$userCheck) {
            if ($avatar) {
                Helper::saveToFile($avatar, $avatar_random_name, $ext);
            }
            $d = $db->insert('members', $data);
            $user = $db->where('email', $email)->getOne('members', 'member_id ,email ,first_name  ,last_name');
            if ($db->count) {
                Queries::send_email_active_member($email, $data['activation_code']);
//                $_SESSION[___APP]['session_key'] = $data['session_id'];
                return $user;

            } else {
                return -95;
            }
        } else {
            return -23;
        }
    }

    static public function send_email_active_member($email , $activation_code)
    {

            $to = $email;
            $to = 'ghinasallit@gmail.com';
            $subject = "Active account";

            $body = "
<html>
<head>
<title></title>
</head>
<body>
<p>Dear,</p>
<table>
<tr>
<a href=http://admin.arabyouthresearch.org/#/login/" . $activation_code . ">Click here to active your acoount </a>
</tr>
</table>
</body>
<table>
</html>
";

// Always set content-type when sending HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
            $headers .= 'From:info@arabyouthresearch.org' . "\r\n";

            mail($to, $subject, $body, $headers);



    }


    static public function active_member($activation_code)
    {

        global $db;
        $data = Array(
            'active' => 1,
            'activation_code' => '',
        );

        $db->where('activation_code', $activation_code);
        $db->update('members', $data);
        $user = $db->where('activation_code', $activation_code)
            ->get("members", null, ' active');
        if ($user) {
            return $user;
        } else {
            return -25;
        }
    }

    static public function updateProfile($member_id, $password, $f_name, $l_name, $avatar, $university, $job, $location, $phone, $Linkedin, $description)
    {

        global $db;

        $data = Array(
            'first_name' => $f_name,
            'last_name' => $l_name,
            'university_id' => $university,
            'domain' => $job,
            'location' => $location,
            'phone' => $phone,
            'Linkedin' => $Linkedin,
            'description' => $description,
        );

        if (!empty($avatar)) {
            $avatar_random_name = uniqid();
            $pos = strpos($avatar, ';');

            $ext = explode(':image/', substr($avatar, 0, $pos))[1];
            $avatar_path = $avatar_random_name . '.' . $ext;
            $data['avatar'] = $avatar_path;
            Helper::saveToFile($avatar, $avatar_random_name, $ext);
        } else {
            $avatar_path = '';
        }

        if (!empty($password)) {
            $data['password'] = md5($password);
        }


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


    static public function isUserExist($email)
    {
        global $db;
        $userCheck = $db->where("email", $email)->get("members");
        if (!$userCheck) {
            return [];
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

    static public function get_member_by_id($member_id)
    {
        global $db;

        $query = " SELECT members.member_id ,members.first_name , members.last_name , country.name_en as country , members.email , members.username  , members.phone , members.location , university.name_en ,university.name_en , members.domain , members.description , members.avatar , university.name_en as university_name_en, university.name_ar as university_name_ar From members JOIN university
                       ON members.university_id = university.university_id 
                        join country ON  university.country_id = country.country_id   WHERE members.member_id = '" . $member_id . "'";


        $member = $db->withTotalCount()->rawQuery($query);


        if ($member) {
            $count_papers = Queries::get_count_papers_for_member($member[0]['member_id']);
            $views = Queries::get_all_views_for_member($member[0]['member_id']);
            $member[0]['views'] = $views[0]['views'];
            $member[0]['count_papers'] = $count_papers[0]['views'];
            return $member[0];
        } else {
            return -26; // member don't found
        }
    }


    static public function get_member_logged_in($member_id)
    {
        global $db;

        $query = " SELECT members.member_id ,members.university_id  ,members.first_name , members.last_name , country.name_en as country , members.email , members.username  , members.phone , members.location , university.name_en ,university.name_en , members.domain , members.description , members.avatar , university.name_en as university_name_en, university.name_ar as university_name_ar From members JOIN university
                       ON members.university_id = university.university_id 
                        join country ON  university.country_id = country.country_id   WHERE members.member_id = '" . $member_id . "'";


        $member = $db->withTotalCount()->rawQuery($query);


        if ($member) {
            $count_papers = Queries::get_count_papers_for_member($member[0]['member_id']);
            $views = Queries::get_all_views_for_member($member[0]['member_id']);
            $member[0]['views'] = $views[0]['views'];
            $member[0]['count_papers'] = $count_papers[0]['views'];
            return $member[0];
        } else {
            return -26; // member don't found
        }
    }

    static public function get_active_members($page, $size, $sort)
    {
        global $db;
        $db->pageLimit = $size;
        $members = $db->where('active', 1)
            ->orderBy('first_name', $sort)
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

    static public function get_statistics()
    {
        global $db;


        $query = "SELECT count(members.member_id) as researchers from members";
        $researchers = $db->withTotalCount()->rawQuery($query);
        $query = "SELECT count(papers.paper_id) as research from papers";
        $research = $db->withTotalCount()->rawQuery($query);
        $query = "SELECT count(discipline_id) as discipline from disciplines";
        $discipline = $db->withTotalCount()->rawQuery($query);
        $query = "SELECT sum(downloads) as downloads from papers";
        $downloads = $db->withTotalCount()->rawQuery($query);

        $statistics['researchers'] = $researchers[0]['researchers'];
        $statistics['research'] = $research[0]['research'];
        $statistics['discipline'] = $discipline[0]['discipline'];
        $statistics['downloads'] = $downloads[0]['downloads'];
        if (!empty($statistics)) {
            if ($db->count) {
                return $statistics;
            } else {
                return -99;

            }
        } else {
            return [];
        }
    }

    static public function get_papers($page, $size)
    {

        // page start from 1
        global $db;
        $page *= $size;
        $q = "SELECT papers.date , papers.description , papers.file , members.username ,  papers.paper_id ,papers.permission , papers.title , papers.views , members.first_name , members.last_name , discipline.discipline_en , discipline.discipline_ar , members.username
                  FROM members JOIN papers ON members.member_id ON paper.paper_id JOIN  discipline ON papers.discipline_id = discipline.discipline_id
                  WHERE  papers.status = 1 ";

        $q_with_paging = $q . " LIMIT {$page} , {$size}";
        $papers = $db->withTotalCount()->rawQuery($q_with_paging);


//        $db->pageLimit = $size;
//        $papers = $db->arraybuilder()->paginate("papers", $page);
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

    static public function get_paper($paper_id)
    {
        global $db;
        $query = "SELECT papers.paper_id , papers.description , papers.title , papers.language , disciplines.discipline_ar , disciplines.discipline_id , disciplines.discipline_en   FROM papers JOIN disciplines  ON papers.discipline_id = disciplines.discipline_id  WHERE papers.paper_id = '" . $paper_id . "'";
        $paper = $db->withTotalCount()->rawQuery($query);
        $query = "SELECT tags.tag_id , tags.tag_en , tags.tag_ar FROM paper_tags JOIN tags  ON paper_tags.tag_id = tags.tag_id  WHERE paper_tags.paper_id = '" . $paper_id . "'";
        $tags = $db->withTotalCount()->rawQuery($query);
        $paper[0]['tags'] = $tags;
        if (!empty($paper)) {

            return $paper[0];
        } else {
            return -99;


        }


    }

    static public function get_countries()
    {
        global $db;
        $query = "SELECT * FROM country";

        $countries = $db->withTotalCount()->rawQuery($query);
        if (!empty($countries)) {
            if ($db->count) {
                return $countries;
            } else {
                return -99;


            }
        } else {
            return [];
        }
    }

    static public function get_years()
    {
        global $db;
        $query = "SELECT DISTINCT YEAR(date) as year FROM papers;";

        $countries = $db->withTotalCount()->rawQuery($query);
        if (!empty($countries)) {
            if ($db->count) {
                return $countries;
            } else {
                return -99;


            }
        } else {
            return [];
        }
    }

    static public function get_tags()
    {
        global $db;
        $query = "SELECT * FROM tags";

        $tags = $db->withTotalCount()->rawQuery($query);
        if (!empty($tags)) {
            if ($db->count) {
                return $tags;
            } else {
                return -99;


            }
        } else {
            return [];
        }
    }

    static public function get_disciplines()
    {
        global $db;
        $query = "SELECT * FROM disciplines";

        $disciplines = $db->withTotalCount()->rawQuery($query);
        if (!empty($disciplines)) {
            if ($db->count) {
                return $disciplines;
            } else {
                return -99;


            }
        } else {
            return [];
        }
    }

    static public function get_universities()
    {
        global $db;
        $query = "SELECT * FROM university";

        $universities = $db->withTotalCount()->rawQuery($query);
        if (!empty($universities)) {
            if ($db->count) {
                return $universities;
            } else {
                return -99;


            }
        } else {
            return [];
        }
    }

    static public function save_paper($paper_id, $user_id)
    {
        global $db;
        $data = Array(
            'member_id' => $user_id,
            'paper_id' => $paper_id
        );
        $bookmark_id = $db->insert('bookmarks', $data);
        $bookmark = $db->where('bookmark_id', $bookmark_id)->getOne('bookmarks', 'bookmark_id');

        if ($bookmark) {
            return $bookmark;
        } else {
            return -25;
        }
    }

    static public function unsave_paper($paper_id, $user_id)
    {

        global $db;

        $db->where('member_id', $user_id)
            ->where('paper_id', $paper_id)
            ->delete('bookmarks');
        $bookmark = $db->where('bookmark_id', $paper_id)
            ->where('member_id', $user_id)
            ->getOne('bookmarks', 'bookmark_id');

        if (!$bookmark) {
            return '';
        } else {
            return -25;
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

    static public function add_download($paper_id, $member_id)
    {

        global $db;

        $owner_paper = $db->where('member_id', $member_id)
            ->where('paper_id', $paper_id)
            ->get("papers", null, 'member_id ');
        if (!$db->count) { // if viewer is not the owner
            $view = $db->where('member_id', $member_id)
                ->where('paper_id', $paper_id)
                ->get("downloads", null, 'download_id ');

            if (!$db->count) { // if the viewer dont visit paper before
                $data = Array(
                    'member_id' => $member_id,
                    'paper_id' => $paper_id
                );
                // get count  views and added one
                $db->insert('downloads', $data);
                $downloads = $db->where('paper_id', $paper_id)
                    ->get("papers", null, 'downloads ');
                $downloads = intval($downloads[0]['downloads']) + 1;
                $data = Array(
                    'views' => $downloads,
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

    static public function is_have_access($member_id, $paper_id)
    {
        global $db;

        $requst = $db->where('member_from', $member_id)
            ->where('paper_id', $paper_id)
            ->getOne("requests", null, 'status');
        if ($requst['status'] == 1) {
            return $requst;
        } else {
            return -99; // member don't active
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
        if ($member[0]['views'] == null) {
            $member[0]['views'] = 0;
        }
        if ($member) {
            return $member;
        } else {
            return -99; // member don't active
        }
    }

    static public function get_published_papers($username, $page, $size)
    {

        // page start from 1
        global $db;
        $page *= $size;

        $q = "SELECT papers.date , papers.description , papers.file , members.username , members.member_id , papers.paper_id ,papers.permission , papers.title , papers.views , members.first_name , members.last_name , disciplines.discipline_en , disciplines.discipline_ar
                  FROM members JOIN papers JOIN  disciplines 
                  ON members.member_id = papers.member_id && 
                   papers.discipline_id = disciplines.discipline_id 
                  WHERE  papers.status = 1 ";
        $q_with_paging = $q . " LIMIT {$page} , {$size}";
        $papers = $db->withTotalCount()->rawQuery($q_with_paging);

        foreach ($papers as $key => $item) {
            $q = "SELECT tags.tag_en , tags.tag_ar FROM papers JOIN paper_tags JOIN tags
                   ON papers.paper_id = paper_tags.paper_id && tags.tag_id = paper_tags.tag_id WHERE papers.paper_id ='" . $item['paper_id'] . "'";
            $tags = $db->withTotalCount()->rawQuery($q);
            $papers[$key]['tags'] = $tags;
        }

        foreach ($papers as $key => $item) {
            if ($username) {
                $q = "SELECT bookmark_id FROM members JOIN bookmarks ON members.member_id = bookmarks.member_id && bookmarks.paper_id = '" . $item['paper_id'] . "'
                      WHERE members.username = '" . $username . "'";
                $is_saves = $db->withTotalCount()->rawQuery($q);
                if ($is_saves) {
                    $papers[$key]['saved'] = 1;
                } else {
                    $papers[$key]['saved'] = 0;
                }
            } else {
                $papers[$key]['saved'] = 0;
            }
        }


        if (!empty($papers)) {

            return $papers;

        } else {
            return [];
        }
    }

    static public function search_paper($username, $page, $size, $country, $discipline, $year, $lang, $keyword)
    {
        // page start from 0
        global $db;
        $page *= $size;
        $data = Array(
            'university.country_id' => $country,
            'papers.date' => $year,
            'papers.language' => $lang,
        );

        $keywords = Array(
            'papers.description' => $keyword,
            'papers.title' => $keyword,
        );
        $q = "SELECT papers.date , papers.description , papers.file , members.username ,  papers.paper_id ,papers.permission ,
               papers.title , papers.views , members.first_name , members.last_name , disciplines.discipline_en , disciplines.discipline_ar
              FROM  papers JOIN members ON papers.member_id = members.member_id 
              JOIN university ON university.university_id = members.university_id 
              JOIN  disciplines ON papers.discipline_id = disciplines.discipline_id WHERE  papers.status = 1  AND (1=1 ";
        foreach ($data as $key => $item) {
            if (!empty($item)) {
                $q .= " AND " . $key . " LIKE " . "'%" . $item . "%' ";
            }
        }

        if ($discipline) {
            $q .= " AND papers.discipline_id = " . "'" . $discipline . "' ";
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
        foreach ($papers as $key => $item) {
            $q = "SELECT tags.tag_en , tags.tag_ar FROM papers JOIN paper_tags JOIN tags
                   ON papers.paper_id = paper_tags.paper_id && tags.tag_id = paper_tags.tag_id WHERE papers.paper_id ='" . $item['paper_id'] . "'";
            $tags = $db->withTotalCount()->rawQuery($q);
            $papers[$key]['tags'] = $tags;
        }

        foreach ($papers as $key => $item) {
            if ($username) {
                $q = "SELECT bookmark_id FROM members JOIN bookmarks ON members.member_id = bookmarks.member_id && bookmarks.paper_id = '" . $item['paper_id'] . "'
                      WHERE members.username = '" . $username . "'";
                $is_saves = $db->withTotalCount()->rawQuery($q);
                if ($is_saves) {
                    $papers[$key]['saved'] = 1;
                } else {
                    $papers[$key]['saved'] = 0;
                }
            } else {
                $papers[$key]['saved'] = 0;
            }
        }


        if (!empty($papers)) {
            return $papers;

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
        $q = "SELECT * FROM  members  WHERE members.active = 1  ";

        if ($keyword) {
            $q .= "AND (1=2 ";
        }
        foreach ($data as $key => $item) {
            if (!empty($item)) {
                $q .= " OR " . $key . " LIKE  " . "'%" . $item . "%' ";
            }
        }
        if ($keyword) {
            $q .= ")";
        }

        if (!empty($letter)) {
            $q .= " AND (first_name LIKE '" . $letter . "%' OR  last_name LIKE '" . $letter . "%')";
        };
        $q_with_paging = $q . " LIMIT {$page} , {$size}";

        $papers = $db->withTotalCount()->rawQuery($q_with_paging);
        if (!empty($papers)) {

            return $papers;
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
        $query = " SELECT MAX(views) as views, country,  member_id  ,  first_name , last_name , avatar , username , job , university_ar , university_en  FROM 
(SELECT SUM(views)as views  ,country.country_id as country_id , country.name_en as country , papers.member_id as member_id , members.first_name as first_name , members.last_name as last_name , members.avatar as avatar , members.username as username , members.domain as job , university.name_ar as university_ar, university.name_en as university_en FROM papers 
                    INNER JOIN members 
                   ON papers.member_id =  members.member_id 
                    INNER JOIN university
                    ON university.university_id =  members.university_id
                    INNER JOIN country
                    ON country.country_id =  university.country_id
                    GROUP BY papers.member_id  HAVING country.name_en  LIKE '%" . $country . "%'  ORDER BY views desc )  AS t1";

        $user = $db->withTotalCount()->rawQuery($query);
        $count_papers = Queries::get_count_papers_for_member($user[0]['member_id']);
        $user[0]['count_papers'] = $count_papers[0]['views'];


        if ($user[0]['views'] == null) {
            return [];
        }
        if ($user) {
            return $user[0];
        } else {
            return ''; // member don't active
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


    static public function send_email_request($code, $paper_id, $message, $member_id_from, $member_email_to, $file)
    {
        global $db;
        $member_from = $db->where('member_id', $member_id_from)
            ->getOne("members", null, 'username', 'email');

        $query = "SELECT members.email from members JOIN papers ON members.member_id = papers.member_id WHERE papers.paper_id = '" . $paper_id . "'";
        $member_to = $db->withTotalCount()->rawQuery($query);

        if ($member_from && $member_to) {


            $to = $member_email_to;
//            $to = 'ghinasallit@gmail.com';
            $subject = "Arab Youth Research/Request";

            $body = "
<html>
<head>
<title></title>
</head>
<body>
<p>Dear,</p>
<p> Please can you give me access on your <a href=http://arabyouthresearch.org/api/uploaded/" . $file . ">paper</a> </p>
<table>
<tr>
<p>$message</p>
</tr>
<tr>
<a href=http://arabyouthresearch.org/#/accept-request/" . $code . ">Click here to confirm </a>
</tr>
</table>
</body>
</html>
";

// Always set content-type when sending HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
            $headers .= 'From:' . $member_from["email"] . "\r\n";

            mail($to, $subject, $body, $headers);
        }
    }


    static public function send_email_accept_access($activation_id, $member_owner)
    {
        global $db;
        $query = "SELECT papers.file , members.email  from papers JOIN requests JOIN members ON papers.paper_id = requests.paper_id && requests.member_to = members.member_id WHERE requests.activation_code = '" . $activation_id . "'";
        $data = $db->withTotalCount()->rawQuery($query);
        $member_from = $db->where('member_id', $member_owner)
            ->getOne('members', 'email');

        $member_to = $data[0]['email'];
        $file = $data[0]['file'];


        if ($member_to && $member_from["email"]) {


            $to = $member_to;
//            $to = 'ghinasallit@gmail.com';
            $subject = "Arab Youth Research/accept Request";

            $body = "
<html>
<head>
<title></title>
</head>
<body>
<p>Dear,</p>
<p> You have access on <a href=http://arabyouthresearch.org/api/uploaded/" . $file . ">paper</a> now.</p>
</body>
</html>
";

// Always set content-type when sending HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
            $headers .= 'From:' . $member_from["email"] . "\r\n";

            mail($to, $subject, $body, $headers);
        }
    }


    static public function accept_request_paper($activation_id, $member_owner)
    {

        global $db;
        $data = Array(

            'status' => 1,
        );

        $db->where('activation_code', $activation_id);
        $db->update('requests', $data);
        $status = $db->where('activation_code', $activation_id)
            ->getOne('requests', 'status');
        if ($status['status'] == 1) {
            Queries::send_email_accept_access($activation_id, $member_owner);
            return $status;
        }


    }


    static public function send_request_paper($paper_id, $message, $member_id)
    {

        global $db;

        $request = $db->where('paper_id', $paper_id)
            ->where('member_from', $member_id)
            ->getOne('requests');

        if (empty($request)) {

            $query = "SELECT members.email , members.member_id , papers.file from members JOIN papers ON members.member_id = papers.member_id WHERE papers.paper_id = '" . $paper_id . "'";
            $member_to = $db->withTotalCount()->rawQuery($query);

            $data = Array(
                'paper_id' => $paper_id,
                'message' => $message,
                'member_from' => $member_id,
                'member_to' => $member_to[0]["member_id"],
                'activation_code' => md5(microtime()),
                'status' => 0,

            );
            $request_id = $db->insert('requests', $data);

            $request = $db->where('request_id', $request_id)
                ->getOne('requests', "paper_id", "member_from", "member_to", "status", "message");
            if ($db->count) {
                Queries::send_email_request($data['activation_code'], $paper_id, $message, $member_id, $member_to[0]["email"], $member_to[0]['file']);

                return $request;

            } else {
                return -25;
            }
        } else {

            return -100;
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


    static public function get_papers_by_member($username, $page, $size)
    {
        // page start from 1
        global $db;
        $page *= $size;


        $q = "SELECT papers.date , papers.description , papers.file , members.username ,  papers.paper_id ,papers.permission , papers.title , papers.views , members.first_name , members.last_name , disciplines.discipline_en , disciplines.discipline_ar
                  FROM members JOIN papers JOIN  disciplines
                  ON members.member_id = papers.member_id   &&
                   papers.discipline_id = disciplines.discipline_id
                  WHERE  papers.status = 1 && members.username ='" . $username . "'";

        $q_with_paging = $q . " LIMIT {$page} , {$size}";
        $papers = $db->withTotalCount()->rawQuery($q_with_paging);

        foreach ($papers as $key => $item) {
            $q = "SELECT tags.tag_en , tags.tag_ar FROM papers JOIN paper_tags JOIN tags
                   ON papers.paper_id = paper_tags.paper_id && tags.tag_id = paper_tags.tag_id WHERE papers.paper_id ='" . $item['paper_id'] . "'";
            $tags = $db->withTotalCount()->rawQuery($q);
            $papers[$key]['tags'] = $tags;
        }

        foreach ($papers as $key => $item) {
            if ($username) {
                $q = "SELECT bookmark_id FROM members JOIN bookmarks ON members.member_id = bookmarks.member_id && bookmarks.paper_id = '" . $item['paper_id'] . "'
                      WHERE members.username = '" . $username . "'";
                $is_saves = $db->withTotalCount()->rawQuery($q);
                if ($is_saves) {
                    $papers[$key]['saved'] = 1;
                } else {
                    $papers[$key]['saved'] = 0;
                }
            } else {
                $papers[$key]['saved'] = 0;
            }
        }

        if (!empty($papers)) {

            return $papers;
        } else {
            return [];

        }

    }


    static public function get_bookmarks($username, $page, $size)
    {
        // page start from 1
        global $db;
        $page *= $size;


        $q = "SELECT papers.date , papers.description , papers.file , members.username ,  papers.paper_id ,papers.permission , papers.title , papers.views , members.first_name , members.last_name , disciplines.discipline_en , disciplines.discipline_ar
                  FROM members JOIN papers JOIN  disciplines JOIN bookmarks
                  ON members.member_id = papers.member_id   &&
                   papers.discipline_id = disciplines.discipline_id
                  WHERE  papers.status = 1 && members.member_id = bookmarks.member_id && papers.paper_id = bookmarks.paper_id && members.username ='" . $username . "'";

        $q_with_paging = $q . " LIMIT {$page} , {$size}";
        $papers = $db->withTotalCount()->rawQuery($q_with_paging);

        foreach ($papers as $key => $item) {
            $q = "SELECT tags.tag_en , tags.tag_ar FROM papers JOIN paper_tags JOIN tags
                   ON papers.paper_id = paper_tags.paper_id && tags.tag_id = paper_tags.tag_id WHERE papers.paper_id ='" . $item['paper_id'] . "'";
            $tags = $db->withTotalCount()->rawQuery($q);
            $papers[$key]['tags'] = $tags;
        }

        foreach ($papers as $key => $item) {
            if ($username) {
                $q = "SELECT bookmark_id FROM members JOIN bookmarks ON members.member_id = bookmarks.member_id && bookmarks.paper_id = '" . $item['paper_id'] . "'
                      WHERE members.username = '" . $username . "'";
                $is_saves = $db->withTotalCount()->rawQuery($q);
                if ($is_saves) {
                    $papers[$key]['saved'] = 1;
                } else {
                    $papers[$key]['saved'] = 0;
                }
            } else {
                $papers[$key]['saved'] = 0;
            }
        }

        if (!empty($papers)) {

            return $papers;
        } else {
            return [];

        }

    }

    static public function search_paper_by_member($username, $page, $size, $country, $discipline, $year, $lang, $keyword)
    {
        // page start from 0
        global $db;
        $page *= $size;
        $data = Array(
            'university.country_id' => $country,
            'papers.date' => $year,
            'papers.language' => $lang,
        );

        $keywords = Array(
            'papers.description' => $keyword,
            'papers.title' => $keyword,
        );
        $q = "SELECT papers.date , papers.description , papers.file , members.username ,  papers.paper_id ,papers.permission ,
               papers.title , papers.views , members.first_name , members.last_name , disciplines.discipline_en , disciplines.discipline_ar
              FROM  papers JOIN members ON papers.member_id = members.member_id 
              JOIN university ON university.university_id = members.university_id 
              JOIN  disciplines ON papers.discipline_id = disciplines.discipline_id WHERE  papers.status = 1  AND members.username = '" . $username . "' AND (1=1 ";
        foreach ($data as $key => $item) {
            if (!empty($item)) {
                $q .= " AND " . $key . " LIKE " . "'%" . $item . "%' ";
            }
        }

        if ($discipline) {
            $q .= " AND papers.discipline_id = " . "'" . $discipline . "' ";
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
        foreach ($papers as $key => $item) {
            $q = "SELECT tags.tag_en , tags.tag_ar FROM papers JOIN paper_tags JOIN tags
                   ON papers.paper_id = paper_tags.paper_id && tags.tag_id = paper_tags.tag_id WHERE papers.paper_id ='" . $item['paper_id'] . "'";
            $tags = $db->withTotalCount()->rawQuery($q);
            $papers[$key]['tags'] = $tags;
        }

        foreach ($papers as $key => $item) {
            if ($username) {
                $q = "SELECT bookmark_id FROM members JOIN bookmarks ON members.member_id = bookmarks.member_id && bookmarks.paper_id = '" . $item['paper_id'] . "'
                      WHERE members.username = '" . $username . "'";
                $is_saves = $db->withTotalCount()->rawQuery($q);
                if ($is_saves) {
                    $papers[$key]['saved'] = 1;
                } else {
                    $papers[$key]['saved'] = 0;
                }
            } else {
                $papers[$key]['saved'] = 0;
            }
        }


        if (!empty($papers)) {
            return $papers;

        } else {
            return [];
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
