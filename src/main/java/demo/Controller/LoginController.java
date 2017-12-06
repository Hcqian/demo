package demo.Controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/")
public class LoginController {


    @RequestMapping("index")
    public String index(){
        System.out.println("indexMapping");
        return  "index";
    }
    @RequestMapping("login")
    public String login(){
        System.out.println("loginMapping");
        return  "login";
    }
    @RequestMapping(value = "doLogin")
    public String doLogin(@RequestParam(value="email") String email,String password,ModelMap model){
        return  "show";
    }
}
