import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {themeColors} from "../assets/theme/themeColors.ts";

export const successAlert = (heading: string, message: string, time = 2000) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: heading,
        text: message,
        showConfirmButton: false,
        timer: time,
        background: themeColors['green'],
        color:themeColors["light"],
        toast: true,
        showCloseButton: true,
    });
}
export const failAlert = (heading: string, message: string, time = 2000) => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: heading,
        text: message,
        showConfirmButton: false,
        timer: time,
        background: themeColors['danger'],
        color:themeColors["light"],
        toast: true,
        showCloseButton: true,
    });
}
// swal2-html-container
// swal2-title
