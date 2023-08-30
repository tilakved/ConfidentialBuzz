import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const successAlert = (heading:string, message:string, time = 2000) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: heading,
        text: message,
        showConfirmButton: false,
        timer: time,
        toast: true,
        showCloseButton: true,
    });
}
export const failAlert = (heading:string, message:string, time = 2000) => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: heading,
        text: message,
        showConfirmButton: false,
        timer: time,
        toast: true,
        showCloseButton: true,
    });
}
