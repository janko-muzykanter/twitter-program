<?php

class twitterAPI {

  private $bearer_token;
  public $raw_data = [];

  function __construct() {

    require "config.php";

    $this->token = $token;
    $this->request_params = $request_params;

    $this->get_bearer_token();
  }

  /*
   *  Sent API KEY request
   *  cacheable
   */
  private function get_bearer_token() {

    $key = base64_encode($this->token['api_key'].":".$this->token['api_secret_key']);

    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://api.twitter.com/oauth2/token",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS =>"grant_type=client_credentials",
      CURLOPT_HTTPHEADER => array(
        "Content-Type: application/x-www-form-urlencoded",
        "Authorization: Basic $key"
      ),
    ));

    $response = curl_exec($curl);
    curl_close($curl);

    $this->bearer_token = json_decode($response, true)['access_token'];

    return true;
  }

  /*
   *  Sent API request
   */
  public function request() {

    $curl = curl_init();

    $url = "https://api.twitter.com/1.1/statuses/user_timeline.json" . "?" . http_build_query($this->request_params);

    curl_setopt_array($curl, array(
      CURLOPT_URL => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array(
        "Authorization: Bearer $this->bearer_token"
      ),
    ));

    $response = curl_exec($curl);
    curl_close($curl);

    $this->raw_data = json_decode($response, true);

    return true;
  }

  public function prepare_output_data() {

    $data = $this->raw_data;

    foreach($data as $row) {
      $this->output_data[] = [
        'id' => $row['id'],
        'date' => date("F j, H:m", strtotime($row['created_at'])),
        'full_text' => $row['full_text'],
        'entities' => $row['entities'],
        'avatar' => $row['user']['profile_image_url_https'],
        'screen_name' => $row['user']['screen_name'],
        'banner' => $row['user']['profile_banner_url'],
      ];
    }

    return $this->output_data;
  }

  public function return_bearer_token() {

    return $this->bearer_token;
  }
}


?>
