const TicketViewRepository = require('../repositories/ticketViewRepository');

class TicketViewController {
    async getAllTickets(req, res) {
        try {
            const tickets = await TicketViewRepository.getAllTickets();
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tickets' });
        }
    }

    async getTicketsByCondition(req, res) {
        const { ticket_topic, department_id, status, user_id, head_id } = req.query;
        try {
            const tickets = await TicketViewRepository.getTicketsByCondition(ticket_topic, department_id, status, user_id, head_id);
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tickets by condition' });
        }
    }

    async getAllTicketHeadView(req, res) {
        try {
            const tickets = await TicketViewRepository.getAllTicketHeadView();
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tickets' });
        }
    }

    async getTicketHeadViewByCondition(req, res) {
        const { ticket_topic, department_id, status, user_id } = req.query;
        try {
            const tickets = await TicketViewRepository.getTicketHeadViewByCondition(ticket_topic, department_id, status, user_id);
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tickets by condition' });
        }
    }
}

module.exports = new TicketViewController();