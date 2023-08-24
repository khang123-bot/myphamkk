export const checkEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export const checkPassword = (password) => {
    let res = '';
    if(password==="") {
        res = "Vui lòng nhập mật khẩu";
    }
    if(password.length < 8) {
        res = "Mật khẩu phải chứa ít nhất 8 kí tự"
    }
    if(password.length > 20) {
        res = "Mật khẩu không được phép vượt quá 20 kí tự"
    }
    if(password.search(/[a-z]/) < 0) { 
        res = "Mật khẩu phải chứa ít nhất 1 kí tự in thường"
    }
    if(password.search(/[A-Z]/) < 0) { 
        res = "Mật khẩu phải chứa ít nhất 1 kí tự in hoa"
    }
    if(password.search(/[0-9]/) < 0) { 
        res = "Mật khẩu phải chứa ít nhất 1 kí tự số"
    }
    return res;
}

export const checkPhoneNumber = (phoneNumber) => {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (vnf_regex.test(phoneNumber) === false) 
        {
            return false;
        } else {
            return true;
        }
    
}



