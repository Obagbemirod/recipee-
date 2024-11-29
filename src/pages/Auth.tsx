import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { AuthSwitch } from "@/components/auth/AuthSwitch";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    jumbleberry: any;
  }
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Jumbleberry tracking
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      ;!function(j,u,m,b,l,e){var n="jumbleberry",i="3.2.3",o=function(){o.v==i&&o.e?o.e.apply(o,arguments):o.q.push(arguments)}
      ,a=encodeURIComponent,t=decodeURIComponent,d=j.location;(o.push=o).l=!1,o.q=[],o.v=i,o.duid=function(n){return(
      n=n&&u.cookie.match(RegExp(t("%5Cs*")+n.substr(0,21)+"id=([^;]+)")))?t(n[1].split(".")[0]):""},o.g=function(n,i){return!!(
      i=RegExp("^[^#]*[?&]"+n+"=([^&#]+)").exec(i||d.href))&&t(i[1].replace(/\\+/g," "))},o.s=function(n){for(var i=Math.round((
      new Date).getTime()/1e3),t=d.hostname.split("."),r=t.length-1;0<r--&&/^(([a-z0-9]{4}-?){8}|[0-9]+)$/i.test(n)&&n!=o.duid(
      o.p);)u.cookie=o.p.substr(0,21)+"id="+a(n)+"."+i+".0."+i+".; path=/; max-age=63072000; domain=."+t.slice(r,t.length
      ).join(".")},o.i=function(n,i,t){if("init"==n)return[o.u=o.duid(o.p=i),o.s(o.h=t||o.u)];t=t||{},(n=u.createElement(
      "iframe")).src=o.d+o.p+"?hid="+a(o.h)+"&uid="+a(o.u)+"&event="+a(i||"")+"&transid="+a(t.transaction_id||"")+"&oi="+a(
      t.order_index||"")+"&ctx="+a(JSON.stringify(t)),n.height=n.width=0,n.style="display:none;visibility:hidden",
      n.sandbox="allow-forms allow-same-origin allow-scripts",n.referrerPolicy="unsafe-url",(u.body||u.head).appendChild(n)},
      o.m=o.e=function(){var n,i;!j._RNGSeed&&o.i.apply(o,arguments)&&(n=u.createElement(m),i=u.getElementsByTagName(m)[0],
      n.src=o.d+o.p+"?hid="+a(o.h)+"&uid="+a(o.u)+"&v="+o.v,n.async=!!o.h,o.e=!1,o.q.unshift(arguments),j.addEventListener(
      "beforeunload",n.onerror=function(){o.e=o.i;for(var n=0;n<o.q.length;++n)o.apply(o,o.q[n]);o.q=[]}),
      i.parentNode.insertBefore(n,i))},j[n]=j[n]||o,j[n].d=b}(window,document,"script","https://www.unique-skipping-kittens.com/");
      
      jumbleberry("init", "ZQBdTfGERq4qFE_Q-FKTmZ19IkvLrOhgpWEBSQfufdfs0XLHM-6aYaYn5bqORzWTFN7x-jMYVBxq-QV9R_n7qA~~");
    `;
    document.head.appendChild(script);
  }, []);

  const onSubmit = async (values: any) => {
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Please check your email and confirm your account before signing in.");
          }
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("The email or password you entered is incorrect. Please try again.");
          }
          throw error;
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/home");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.name,
            },
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("An account with this email already exists. Please sign in instead.");
          }
          throw error;
        }

        // Track successful registration
        if (window.jumbleberry) {
          window.jumbleberry("track", "CompleteRegistration");
        }

        toast({
          title: "Account created successfully!",
          description: "Please check your email to confirm your account.",
        });
        navigate("/onboarding");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 p-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Sign in to your account" : "Start your journey today"}
          </p>
        </div>

        <AuthSwitch isLogin={isLogin} onToggle={(checked) => setIsLogin(!checked)} />

        {isLogin ? (
          <LoginForm onSubmit={onSubmit} />
        ) : (
          <SignUpForm onSubmit={onSubmit} />
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuth isLogin={isLogin} />
      </motion.div>
    </div>
  );
};

export default Auth;