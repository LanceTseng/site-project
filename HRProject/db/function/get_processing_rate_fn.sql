CREATE DEFINER=`lance`@`%` FUNCTION `get_processing_rate_fn`(p_parent_task_id INT) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
    DECLARE ln_ct_total INT;
    DECLARE ln_ct_done INT;
    DECLARE ln_ct_rate DECIMAL(10,2);
    
    -- Get total count of child tasks
SELECT 
    COUNT(1)
INTO ln_ct_total FROM
    v_user_child_task ct
WHERE
    ct.user_parenttask_id = p_parent_task_id;
    
    -- Get count of completed child tasks
SELECT 
    COUNT(1)
INTO ln_ct_done FROM
    v_user_child_task ct
WHERE
    ct.user_parenttask_id = p_parent_task_id
        AND ct.ct_status_name = 'completed';
    
    -- Calculate completion percentage
    IF ln_ct_total > 0 THEN
        SET ln_ct_rate = (ln_ct_done / ln_ct_total) * 100;
    ELSE
        -- here
          -- Get total count of child tasks
    SELECT COUNT(1) INTO ln_ct_total 
    FROM rel_user_parenttask ct 
    WHERE ct.id = p_parent_task_id;
    
    -- Get count of completed child tasks
SELECT 
    COUNT(1)
INTO ln_ct_done FROM
    rel_user_parenttask ct
WHERE
    ct.id = p_parent_task_id
        AND ct.status = 2;
        SET ln_ct_rate = (ln_ct_done / ln_ct_total) * 100;
    END IF;
    
    RETURN ln_ct_rate;
END