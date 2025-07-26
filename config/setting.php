<?php

return [
    'general' => [
        'web_name' => 'Security Inspection System',
        'web_name_short' => 'SIS',
        'web_description' => 'Security Inspection System',
        'web_keywords' => 'sis, security, inspection, system',
        'web_author' => 'theadamz',
        'web_email' => 'theadamz91@gmail.com',
        'company_name' => 'HAS Soft',
        'company_name_short' => 'HAS',
        'version' => '1.0.0',
        'copyright' => 'HAS Soft 2024',
    ],
    'local' => [
        'charset' => 'UTF-8',
        'locale' => 'id_ID',
        'locale_short' => 'id',
        'locale_long' => 'id-ID|id_ID.UTF-8',
        'timezone' => 'Asia/Jakarta',
        'country' => 'Indonesia',
        'numeric_thousand_separator' => '.',
        'numeric_decimal_separator' => ',',
        'numeric_precision_length' => 2,
        'js_date_format' => 'dd/MM/yyyy',
        'js_time_format' => 'HH:mm',
        'js_datetime_format' => 'dd/MM/yyyy HH:mm',
        'jasper_format_date' => 'd/MM/yyyy',
        'jasper_format_time' => 'HH:mm',
        'jasper_format_datetime' => 'd/MM/yyyy HH:mm',
        'jasper_format_integer' => '#,##0',
        'jasper_format_float' => '#,##0.00#;(#,##0.00#)',
        'jasper_format_number' => '#,##0;(#,##0)',
        'backend_datetime_format' => 'd/m/Y H:i',
        'backend_date_format' => 'd/m/Y',
        'backend_time_format' => 'H:i',
    ],
    'other' => [
        'max_file_attachment' => 4,
        'max_file_size' => 25600,
        'file_doc_attachment_allowed' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'csv', 'txt'],
        'file_img_allowed' => ['png', 'jpg', 'jpeg', 'bmp'],
        'path_to_upload' => 'contents',
        'path_to_temp' => 'contents/temp',
    ],
    'page' => [
        'limits' => [5, 10, 25, 50, 100],
        'default_limit' => 50,
    ],
    'sequence' => [
        'year_format' => 'y',
        'month_format' => 'n',
        'array_format' => ['site_code' => '{site_code}', 'prefix' => '{prefix}', 'suffix' => '{suffix}', 'year' => '{year}', 'month' => '{month}', 'seq' => '{seq}'],
        'format_seq_default' => '{prefix}/{site_code}/{year}/{month}/{seq}',
    ],
    'method' => [
        'allowed' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    ],
    'cacheTime' => 60 * 2, // default cache time : 2 menit
    'regxp' => [
        'forCode' => "/^[A-Za-z0-9-+=^]*$/",
        'forUsername' => "/^[A-Za-z0-9-+=^@.]*$/",
        'forTransType' => "/^[A-Za-z_{}#+=\/-]*$/",
    ],
    'data' => [
        'test' => [1, 2, 3],
    ],
];
