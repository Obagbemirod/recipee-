import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ChefHat } from "lucide-react";

declare global {
  interface Window {
    jumbleberry: any;
  }
}

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get('transaction_id') || '';
  const orderValue = searchParams.get('order_value') || '';

  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      ;!function(j,u,m,b,l,e){var n="jumbleberry",i="3.2.3",o=function(){o.v==i&&o.e?o.e.apply(o,arguments):o.q.push(arguments)},a=encodeURIComponent,t=decodeURIComponent,d=j.location;(o.push=o).l=!1,o.q=[],o.v=i,o.duid=function(n){return(n=n&&u.cookie.match(RegExp(t("%5Cs*")+n.substr(0,21)+"id=([^;]+)")))?t(n[1].split(".")[0]):""},o.g=function(n,i){return!!(i=RegExp("^[^#]*[?&]"+n+"=([^&#]+)").exec(i||d.href))&&t(i[1].replace(/\\+/g," "))},o.s=function(n){for(var i=Math.round((new Date).getTime()/1e3),t=d.hostname.split("."),r=t.length-1;0<r--&&/^(([a-z0-9]{4}-?){8}|[0-9]+)$/i.test(n)&&n!=o.duid(o.p);)u.cookie=o.p.substr(0,21)+"id="+a(n)+"."+i+".0."+i+".; path=/; max-age=63072000; domain=."+t.slice(r,t.length).join(".")},o.i=function(n,i,t){if("init"==n)return[o.u=o.duid(o.p=i),o.s(o.h=t||o.u)];t=t||{},(n=u.createElement("iframe")).src=o.d+o.p+"?hid="+a(o.h)+"&uid="+a(o.u)+"&event="+a(i||"")+"&transid="+a(t.transaction_id||"")+"&oi="+a(t.order_index||"")+"&ctx="+a(JSON.stringify(t)),n.height=n.width=0,n.style="display:none;visibility:hidden",n.sandbox="allow-forms allow-same-origin allow-scripts",n.referrerPolicy="unsafe-url",(u.body||u.head).appendChild(n)},o.m=o.e=function(){var n,i;!j._RNGSeed&&o.i.apply(o,arguments)&&(n=u.createElement(m),i=u.getElementsByTagName(m)[0],n.src=o.d+o.p+"?hid="+a(o.h)+"&uid="+a(o.u)+"&v="+o.v,n.async=!!o.h,o.e=!1,o.q.unshift(arguments),j.addEventListener("beforeunload",n.onerror=function(){o.e=o.i;for(var n=0;n<o.q.length;++n)o.apply(o,o.q[n]);o.q=[]}),i.parentNode.insertBefore(n,i))},j[n]=j[n]||o,j[n].d=b}(window,document,"script","https://www.unique-skipping-kittens.com/");
    `;
    document.head.appendChild(script);

    if (window.jumbleberry && transactionId && orderValue) {
      window.jumbleberry("init", "ZQBdTfGERq4qFE_Q-FKTmZ19IkvLrOhgpWEBSQfufdfs0XLHM-6aYaYn5bqORzWTFN7x-jMYVBxq-QV9R_n7qA~~");
      window.jumbleberry("track", "Purchase", { 
        transaction_id: transactionId,
        order_value: orderValue
      });
    }
  }, [transactionId, orderValue]);

  const handleProceed = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('country, cuisine_style')
      .eq('id', user.id)
      .single();

    if (!profile?.country || !profile?.cuisine_style) {
      navigate('/onboarding');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent">
      <div className="w-full max-w-md space-y-8 text-center">
        <img 
          src="/lovable-uploads/4aa0753d-5079-4050-99bb-ff490ee12bb4.png" 
          alt="Recipee Logo" 
          className="mx-auto w-48 mb-8"
        />
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <h1 className="text-4xl font-bold text-secondary">Thank You!</h1>
          <p className="text-xl text-muted-foreground">Your purchase was successful.</p>
          <Button
            onClick={handleProceed}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <ChefHat className="mr-2 h-5 w-5" />
            Proceed to Recipee
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;