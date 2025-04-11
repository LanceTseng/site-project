CREATE DEFINER=`lance`@`%` FUNCTION `get_child_task_desc_fn`(p_task_id INT) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE lv_task_desc VARCHAR(255);

    SELECT child_task_description INTO lv_task_desc 
    FROM b_child_tasks 
    WHERE child_task_id = p_task_id;

    RETURN lv_task_desc;
END