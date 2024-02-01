import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from './auth-response.model';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api_key = environment.api_key
  user = new BehaviorSubject<User | null>(null)
  constructor(private http: HttpClient) { }

  register(email: string, password: string){
    return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + this.api_key, {
      email: email,
      password: password,
      returnSecureToken: true,
    }).pipe(
      tap(res => {
        this.handleUser(res.email, res.localId, res.idToken, res.expiresIn)
      }),
      catchError(this.handleError)
    )
  }

  login(email: string, password: string){
    return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + this.api_key ,{
      email: email,
      password: password,
      returnSecureToken: true,
    }).pipe(
      tap(res => {
        this.handleUser(res.email, res.localId, res.idToken, res.expiresIn)
      }),
      catchError(this.handleError)
    )
  }

  autoLogin(){
    if(localStorage.getItem("user") == null){
      return
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const loadedUser = new User(user.email, user.id, user._token, new Date(user._tokenExpirationDate))
    if(loadedUser.token){
      this.user.next(loadedUser)
    }
  }

  logOut(){
    this.user.next(null)
    localStorage.removeItem("user")
  }

  private handleError(err: HttpErrorResponse){
    let message = "Hata Oluştu"
    if(err.error.error){
      switch(err.error.error.message){
        case "EMAIL_EXISTS":
          message = "Bu mail adresi zaten kullanılıyor."
          break
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          message = "Çok denediniz, bir süre bekleyip tekrar deneyiniz."
          break
        case "EMAIL_NOT_FOUND":
          message = "Bu mail adresi ile eşleşen bir kullanıcı yok."
          break
        case "INVALID_PASSWORD":
          message = "Yanlış parola."
          break
        case "INVALID_LOGIN_CREDENTIALS":
          message = "E-mail veya parola yanlış."
          break
      }
    }
    return throwError(()=> message)
  }

  private handleUser(email: string, localId: string, idToken: string, expiresIn: string){
    const expirationDate = new Date(new Date().getTime() + (+expiresIn * 1000))
    const user = new User(
      email,
      localId,
      idToken,
      expirationDate
    )
    this.user.next(user)
    localStorage.setItem("user", JSON.stringify(user))
  }
}
