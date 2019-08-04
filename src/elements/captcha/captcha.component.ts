import {Component, OnInit} from '@angular/core';
import Speech from 'speak-tts';

const speech = new Speech();


@Component({
    selector: 'app-captcha',
    templateUrl: './captcha.component.html',
    styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {
    private toSpeak: string;

    constructor() {
    }

    code;
    lengthCaptcha = 5;

    createCaptcha() {
        document.getElementById('captcha').innerHTML = '';
        const charsArray =
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lengthOtp = this.lengthCaptcha;
        const captcha = [];
        for (let i = 0; i < lengthOtp; i++) {
            const index = Math.floor(Math.random() * charsArray.length + 1);
            if (captcha.indexOf(charsArray[index]) == -1) {
                captcha.push(charsArray[index]);
            } else {
                i--;
            }
        }
        this.toSpeak = captcha.join('');
        console.log(this.toSpeak);

        const canv = document.createElement('canvas');
        canv.id = 'captcha';
        canv.width = 150;
        canv.height = 50;
        const ctx = canv.getContext('2d');

        ctx.font = '25px Georgia';
        ctx.fillStyle = '#000';

        this.code = captcha.join('');
        ctx.fillText(this.code, 25, 35);
        if (this.code.length == this.lengthCaptcha) {
            document.getElementById('captcha').appendChild(canv);
        } else {
            this.createCaptcha();
        }
    }

    speak() {
        speech.speak({
            text: this.toSpeak,
        });
    }

    ngOnInit() {
        this.createCaptcha();
    }

}
