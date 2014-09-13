<?php
require 'facebook-php-sdk/src/facebook.php';
require 'secret.php';

$facebook = new Facebook(array(
	'appId'  => '326107390905557',
	'secret' => $secret
));

$id = split("/", $_GET['url']);
if ($id[4] == "posts") {
    $id = $id[sizeof($id)-1];
} else {
    $id = $id[sizeof($id)-2];
}
$likes = $facebook->api("/$id/likes?limit=2000")['data'];

$filtered = Array();
foreach ($likes as $user) {
	$filtered[] = $user["name"];
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Sektionsmötesbingo</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="styles.css" />
    <script>var likes = <?=json_encode($filtered)?>;</script>
	<script src="scripts.js"></script>
</head>
<body onload="loadpage();">
	<ul></ul>
    <div id="pointer">
        <span>-----&gt;</span>
        <span>&lt;-----</span>
    </div>
    <div id="popup">
        <marquee scrollamount="40" behavior="alternate">
            WINNER!!!
        </marquee>
        <div>
            <span class="blink">CONGRATULATION!!!!!!!!</span><br />
            <span id="winner"></span><br />
            YOU ARE THE 1,000,000th VISITOR!!!
        </div>
        <marquee scrollamount="23" behavior="alternate">
            WINNER!!!
        </marquee>
    </div>
</body>
</html>
