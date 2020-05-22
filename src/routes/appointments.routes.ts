import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { startOfHour, parseISO } from 'date-fns';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find({
    relations: ['provider'],
    where: {
      provider_id: request.user.id,
    },
  });

  return response.json({ appointments });
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate: Date = startOfHour(parseISO(date));

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
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
