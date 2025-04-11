CREATE DEFINER=`lance`@`%` FUNCTION `get_user_task_user_id_by_id_fn`(p_head_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE ln_user_id VARCHAR(255);

    SELECT user_id INTO ln_user_id 
    FROM v_user_parent_task 
    WHERE head_id = p_head_id 
    LIMIT 1;

    RETURN ln_user_id;
END