CREATE DEFINER=`lance`@`%` FUNCTION `get_parent_task_desc_fn`(p_task_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_task_desc VARCHAR(255);

    SELECT task_description INTO lv_task_desc 
    FROM b_parent_tasks 
    WHERE task_id = p_task_id;

    RETURN lv_task_desc;
END