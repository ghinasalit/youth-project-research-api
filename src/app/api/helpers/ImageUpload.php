<?php

class FileUpload
{

    public static function upload_image()
    {

        $errors = [];
        $fileExtensions = ['.jpeg', '.jpg', '.png'];
        if ($_FILES['file']) {
            $path = 'uploaded/';
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $originalName = $_FILES['file']['name'];
            $fileSize = $_FILES['file']['size'];


            $ext = strtolower( '.' . pathinfo($originalName, PATHINFO_EXTENSION));

var_dump($ext);
            $t = time();
            $generatedName = md5($t . $originalName) . $ext;
            $filePath = $path . $generatedName;
            if (!in_array($ext, $fileExtensions)) {
                return -27;
                $errors[] = "This file extension is not allowed. Please upload a JPEG or PNG file";
            }

            if ($fileSize > 2000000) {
                return -29;
                $errors[] = "This file is more than 2MB. Sorry, it has to be less than or equal to 2MB";
            }

            if (empty($errors)) {
                $didUpload = move_uploaded_file($_FILES['file']['tmp_name'], $filePath);

                if ($didUpload) {
                    return $generatedName;
                } else {
                    return -32;
                    echo "An error occurred somewhere. Try again or contact the admin";
                }
            } else {
                foreach ($errors as $error) {
                    echo $error . "These are the errors" . "\n";
                }
            }
        }


    }

    public static function upload_file()
    {

        $errors = [];
        $fileExtensions = ['.doc', '.pdf'];
        if ($_FILES['file']) {
            $path = 'uploaded/';
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $originalName = $_FILES['file']['name'];
            $fileSize = $_FILES['file']['size'];


            $ext = strtolower( '.' . pathinfo($originalName, PATHINFO_EXTENSION));

            var_dump($ext);
            $t = time();
            $generatedName = md5($t . $originalName) . $ext;
            $filePath = $path . $generatedName;
            if (!in_array($ext, $fileExtensions)) {
                return -27;
                $errors[] = "This file extension is not allowed. Please upload a JPEG or PNG file";
            }

            if ($fileSize > 2000000) {
                return -29;
                $errors[] = "This file is more than 2MB. Sorry, it has to be less than or equal to 2MB";
            }

            if (empty($errors)) {
                $didUpload = move_uploaded_file($_FILES['file']['tmp_name'], $filePath);

                if ($didUpload) {
                    return $generatedName;
                } else {
                    return -32;
                    echo "An error occurred somewhere. Try again or contact the admin";
                }
            } else {
                foreach ($errors as $error) {
                    echo $error . "These are the errors" . "\n";
                }
            }
        }


    }
}


?>
