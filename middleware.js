import { withAuth} from "next-auth/middleware";
import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
const regexGuest=(cPath)=>{
  if(cPath=="") return false;
  let regexGuest=["admin","restaurant","role"]; 
  let isRegex = regexGuest.some(item => item.startsWith(cPath)); //ควบคุมการเข้าถึง path 
  return isRegex
}

const regexRestaurant=(cPath)=>{
  if(cPath=="") return false;
  let regexRestaurant=["admin","register","login","role"]; 
  let isRegex = regexRestaurant.some(item => item.startsWith(cPath)); //ควบคุมการเข้าถึง path 
  return isRegex
}

const regexAdmin=(cPath)=>{
  if(cPath=="") return false;
  let regexAdmin=["restaurant","register","login","role"]; 
  let isRegex = regexAdmin.some(item => item.startsWith(cPath)); //ควบคุมการเข้าถึง path 
  return isRegex
}

const regexUser=(cPath)=>{
  if(cPath=="") return false;
  let regexUser=["restaurant","register","login","role","admin"]; 
  let isRegex = regexUser.some(item => item.startsWith(cPath)); //ควบคุมการเข้าถึง path 
  return isRegex
}

const api = {
  checkAdmin:async(email)=>{
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/checkadmin?email=${email}`;
      const response = await fetch(apiUrl);
      const result = await response.json();
      return result;
  }
}

export default withAuth(
  async function middleware(request){
    const _token = await getToken({req:request,secret:process.env.NEXTAUTH_SECRET});
    //ตรวจสอบการเข้าถึง route ต่าง ๆ 
    let currentPath = String(request.nextUrl.pathname).split("/").filter(url=>url!=='')[0];


    if (!_token){ //case guest
        //ปัดกลับไปหน้าแรก
        if (regexGuest(currentPath)) {
          return NextResponse.redirect(new URL('/login', request.url))  
        }
    } else {
    //case role
    switch (_token?.role) {
      case "":
         const isAdmin = await  api.checkAdmin(_token?.email);
        if(isAdmin && currentPath!=='acceptadmin' && currentPath!=='api' && currentPath!=='images') {
          return NextResponse.redirect(new URL('/acceptadmin', request.url))
        }
        if (!isAdmin && currentPath!=='role' && currentPath!=='api'){
          return NextResponse.redirect(new URL('/role', request.url))
         }
        break;
        case "user":
          if (regexUser(currentPath)){
            return NextResponse.redirect(new URL("/", request.url));
          }
        break;

        case "restaurant":
          if (regexRestaurant(currentPath)){
            return NextResponse.redirect(new URL("/", request.url));
          }
        break;
        case "admin":
          if (regexAdmin(currentPath)){
            return NextResponse.redirect(new URL("/", request.url));
          }
        break;   
        default:
            return NextResponse.redirect(new URL("/login", request.url));
    }  
    }    
  },{
    callbacks:{
      authorized({token,req}){
        return true;
      }
    }
  }
);
export const config = {
  matcher: [
    // Match all routes except the ones that start with /login and api and the static folder
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};