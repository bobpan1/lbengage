<?php
// | [RhaPHP System] Copyright (c) 2017 http://www.rhaphp.com/
// +----------------------------------------------------------------------
// | [RhaPHP] 并不是自由软件,你可免费使用,未经许可不能去掉RhaPHP相关版权
// +----------------------------------------------------------------------
// | Author: Geeson <qimengkeji@vip.qq.com>
// | Author: Bob , according baidu free voice API 2018-4-22
// +----------------------------------------------------------------------

namespace app\common\model;
use think\Model;

require_once '/www/extend/baiduAPI/AipSpeech.php';
require_once '/www/extend/baiduAPI/AipOcr.php';

class BaiduApi extends Model
{

    public function voiceToTxt($voiceData){
    	
    		$APP_ID = '7087275';
				$API_KEY = 'PXg3EbbgGAqXLICYAB4zKW8N';
				$SECRET_KEY = 'P6XZ5Tg2NtONSZOG53UNm5agFC3LirYe';    		
    		
    		$client = new \AipSpeech($APP_ID, $API_KEY, $SECRET_KEY);
    		
    		if($client != null){
    			$result =  $client->asr($voiceData, 'amr', 8000, array('dev_pid' => '1537','lan' => 'ct'));
    			file_put_contents("/www/runtime/temp/log.txt", "\r\n RESULT".json_encode($result), FILE_APPEND);
    			return $result;
    		}else{
    			file_put_contents("/www/runtime/temp/log.txt", "\r\n FAIL TO CALL BAIDU API", FILE_APPEND);
    		}
  	}
  	
  	public function getInvoiceInfoByBaidu($imageData){
/*   	
    		$APP_ID = '11194874';
				$API_KEY = 'MNHvWA5VtsHs2eLxiUkGCIRl';
				$SECRET_KEY = '3zpRwyGRuH2xClc85w7asRm0WD2SxWN5';  
*/				
				$APP_ID = '11260487';
				$API_KEY = 'Aw8GaNW6Rit9rdW6evSkYp8Q';
				$SECRET_KEY = 'qNtDfqUpK9c2NzHZibWDmCh9sC2FjRMb';  
				  		
    		
    		$client = new \AipOcr($APP_ID, $API_KEY, $SECRET_KEY);
    		
    		$image = $imageData;//file_get_contents('/www/runtime/example.jpg');
				
				// 调用通用票据识别
				//$client->receipt($image);
				
				// 如果有可选参数
				$options = array();
				$options["recognize_granularity"] = "big";
				$options["probability"] = "true";
				$options["accuracy"] = "normal";
				$options["detect_direction"] = "true";
				
				// 带参数调用通用票据识别
				$result = $client->receipt($image, $options);
				return $result;
  	}
    
		public function checkInvoiceDetail($fpdm, $fphm, $date, $mark){
				
			$host = "https://fapiao.market.alicloudapi.com";
	    $path = "/invoice/query";
	    $method = "GET";
	    $appcode = "9822ea748b8f4e32864fb839d3766403";
	    $headers = array();
	    array_push($headers, "Authorization:APPCODE " . $appcode);
	    //$querys = "fpdm=4403171320&fphm=01815402&isCover=isCover&kprq=20180313&mark=701248";
	    $querys = "fpdm=".$fpdm."&fphm=".$fphm."&isCover=isCover&kprq=".$date."&mark=".$mark;
	    
	    $bodys = "";
	    $url = $host . $path . "?" . $querys;
	
	    $curl = curl_init();
	    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
	    curl_setopt($curl, CURLOPT_URL, $url);
	    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	    curl_setopt($curl, CURLOPT_FAILONERROR, false);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($curl, CURLOPT_HEADER, false);
	    if (1 == strpos("$".$host, "https://"))
	    {
	        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	    }
	   	$ret =  curl_exec($curl);
	   	if(strstr($ret,'false')){
	  		return array();
	  	}else{
	   		$retArray = json_decode($ret,true);
	    	return $retArray;
	    }
	    //$str = "[核验成功] 发票主要信息如下：\r\n";
	   /*	foreach ($retArray as $key => $val){
	  		if(!empty($key) && $key!='' && !empty($val) && $val!=''){
	  			$str = $str.$key. mb_convert_encoding($val, "utf-8","gb2312");
	  		}
	  	}*/
/*
	  	curl_close($curl);
	  	return "已核对信息如下：\r\n".
	  				"发票代码:".$retArray['fpdm']."\r\n".
	  				"发票编号:".$retArray['fphm']."\r\n".
	  				"开票日期:".$retArray['kprq']."\r\n".
	  				"名称:".$retArray['gfMc']."\r\n".
	  				"发票金额:".$retArray['sumamount']."\r\n".
	  				"开票单位:".$retArray['xfMc']."\r\n"
	  					;
*/
		}
		
		
		public function getInvoiceInfoByAli($imageData){

			$host = "https://ocrapi-invoice.taobao.com";
	    $path = "/ocrservice/invoice";
	    $method = "POST";
	    $appcode = "9822ea748b8f4e32864fb839d3766403";
	    $headers = array();
	    array_push($headers, "Authorization:APPCODE " . $appcode);
	    //根据API的要求，定义相对应的Content-Type
	    array_push($headers, "Content-Type".":"."application/json; charset=UTF-8");
	    $querys = "";
	    $bodys = '{"img":"'.base64_encode($imageData).'"}';
	    $url = $host . $path;
	
	    $curl = curl_init();
	    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
	    curl_setopt($curl, CURLOPT_URL, $url);
	    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	    curl_setopt($curl, CURLOPT_FAILONERROR, false);
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($curl, CURLOPT_HEADER, false);
	    if (1 == strpos("$".$host, "https://")){
	        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	    }
	    curl_setopt($curl, CURLOPT_POSTFIELDS, $bodys);
	    $ret = curl_exec($curl);
	    file_put_contents("/www/runtime/temp/log.txt", "\r\n ---ALI RET--1- ".$ret, FILE_APPEND);
	    
	    $retArray = json_decode(urldecode($ret),true);
	    if(isset($retArray['data']))
	    	return $retArray['data'];
	    else 
	    	return array();
		}
		
}

?>