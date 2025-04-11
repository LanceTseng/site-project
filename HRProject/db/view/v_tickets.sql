CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `lance`@`%` 
    SQL SECURITY DEFINER
VIEW `hrproject`.`v_tickets` AS
    SELECT 
        `hrproject`.`b_ticket_head`.`id` AS `ticket_id`,
        `hrproject`.`b_ticket_head`.`ticket_topic` AS `ticket_topic`,
        `hrproject`.`b_ticket_head`.`description` AS `ticket_description`,
        `hrproject`.`b_ticket_head`.`ticket_department_id` AS `ticket_department_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('department',
                `hrproject`.`b_ticket_head`.`ticket_department_id`) AS `department_name`,
        `hrproject`.`b_ticket_head`.`status` AS `ticket_status_id`,
        GET_OBJECT_TYPE_ITEM_VALUE_FN('ticket_status',
                `hrproject`.`b_ticket_head`.`status`) AS `ticket_status_name`,
        `hrproject`.`b_ticket_head`.`created_date` AS `ticket_request_date`,
        `hrproject`.`b_ticket_head`.`created_by` AS `ticket_request_by_id`,
        GET_USER_NAME_FN(`hrproject`.`b_ticket_head`.`created_by`) AS `ticket_request_by_name`,
        `hrproject`.`b_ticket_head`.`last_updated_date` AS `ticket_last_updated_date`,
        `hrproject`.`b_ticket_detail`.`id` AS `response_id`,
        `hrproject`.`b_ticket_detail`.`response` AS `response_text`,
        `hrproject`.`b_ticket_detail`.`created_by` AS `response_by_id`,
        GET_USER_NAME_FN(`hrproject`.`b_ticket_detail`.`created_by`) AS `response_by_name`,
        `hrproject`.`b_ticket_detail`.`created_date` AS `response_date`,
        `hrproject`.`b_ticket_detail`.`reponse_order` AS `response_order`
    FROM
        (`hrproject`.`b_ticket_head`
        LEFT JOIN `hrproject`.`b_ticket_detail` ON ((`hrproject`.`b_ticket_head`.`id` = `hrproject`.`b_ticket_detail`.`ticket_head_id`)))