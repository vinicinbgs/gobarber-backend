import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  try {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointments = await appointmentsRepository.find({
      relations: ['provider'],
    });

    return response.json({
      data: appointments,
    });
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    const parsedDate: Date = startOfHour(parseISO(date));

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({
      message: err.message,
    });
  }
});

/* appointmentsRouter.put('/:id', (request, response) => {
  const { id } = request.params;
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameDate = appointmentsRepository.findByDate(
    parsedDate,
  );

  if (findAppointmentInSameDate) {
    return response.status(400).json({
      message: 'This appointment is already booked',
    });
  }

  const appointment = appointmentsRepository.update({
    id,
    provider,
    date: parsedDate,
  });

  if (!appointment) {
    return response.json({
      message: 'not exists',
    });
  }

  return response.json({
    data: appointment,
  });
}); */

export default appointmentsRouter;
