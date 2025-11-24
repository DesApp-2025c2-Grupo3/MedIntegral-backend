const { errorPersonalizado } = require('../middlewares/genericMiddleware');

const convertirAMinutos = (horario) => {
    const [hora, minutos] = horario.split(":").map(Number);
    return hora * 60 + minutos;
};

const horariosCorrectos = (horario, next) => {
    if (convertirAMinutos(horario.horaInicio) >= convertirAMinutos(horario.horaFin)) {
        return errorPersonalizado(`La hora de fin debe ser mayor a la hora de inicio`, 400, next);
    }
}

//deberia hacer esto para cada lugar que creo
const noSeSuperponenHorarios = (horarios, next) => {

    // Recorremos todas las combinaciones posibles de horarios
    for (let i = 0; i < horarios.length; i++) {
        for (let j = i + 1; j < horarios.length; j++) {
            const h1 = horarios[i];
            const h2 = horarios[j];

            // Vemos si hay algún día en común
            const diasEnComun = h1.dias.filter((dia) => h2.dias.includes(dia));
            if (diasEnComun.length === 0) continue; // Si no comparten días, no hay conflicto

            // Convertimos a minutos
            const inicio1 = convertirAMinutos(h1.horaInicio);
            const fin1 = convertirAMinutos(h1.horaFin);
            const inicio2 = convertirAMinutos(h2.horaInicio);
            const fin2 = convertirAMinutos(h2.horaFin);

            // Verificamos superposición
            if (inicio1 < fin2 && inicio2 < fin1) {
                return errorPersonalizado(`Los horarios ${h1.horaInicio}-${h1.horaFin} y ${h2.horaInicio}-${h2.horaFin} se superponen en los días: ${diasEnComun.join(", ")}`, 400, next);
            }
        }
    }
}

const minutosAString = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

module.exports = { convertirAMinutos, horariosCorrectos, noSeSuperponenHorarios, minutosAString }; 

