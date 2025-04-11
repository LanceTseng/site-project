CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_user_form` AS
    SELECT 
        `hrproject`.`rel_user_form`.`id` AS `id`,
        `hrproject`.`b_form_design`.`form_type_id` AS `form_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('form_ques_type',
                `hrproject`.`b_form_design`.`form_type_id`) AS `form_type_name`,
        `hrproject`.`rel_user_form`.`form_id` AS `form_id`,
        `hrproject`.`b_form_design`.`form_name` AS `form_name`,
        `hrproject`.`rel_user_form`.`form_question_id` AS `form_question_id`,
        `hrproject`.`b_form_design`.`form_question_display` AS `question_display`,
        `hrproject`.`b_form_design`.`form_question_type_id` AS `question_type_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('form_ques_type',
                `hrproject`.`b_form_design`.`form_question_type_id`) AS `ques_type_name`,
        `hrproject`.`rel_user_form`.`form_question_response` AS `question_response`,
        `hrproject`.`rel_user_form`.`user_childtask_id` AS `user_childtask_id`,
        `hrproject`.`rel_user_form`.`created_date` AS `form_created_date`,
        `hrproject`.`rel_user_form`.`last_updated_date` AS `form_updated_date`
    FROM
        (`hrproject`.`rel_user_form`
        LEFT JOIN `hrproject`.`b_form_design` ON ((`hrproject`.`rel_user_form`.`form_question_id` = `hrproject`.`b_form_design`.`form_question_id`)))