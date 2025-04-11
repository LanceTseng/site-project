CREATE DEFINER=`lance`@`%` FUNCTION `GET_DOCUMENT_NAME_FN`(p_doc_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_doc_name VARCHAR(255);
    
    -- Retrieve document name
    SELECT document_name INTO lv_doc_name 
    FROM b_documents 
    WHERE document_id = p_doc_id 
    LIMIT 1;
    
    RETURN lv_doc_name;
END