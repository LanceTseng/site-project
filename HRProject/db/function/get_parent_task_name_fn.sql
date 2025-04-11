CREATE DEFINER=`lance`@`%` FUNCTION `get_parent_task_name_fn`(p_task_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_task_name VARCHAR(255);

    SELECT task_name INTO lv_task_name 
    FROM b_parent_tasks 
    WHERE task_id = p_task_id;

    RETURN lv_task_name;
END