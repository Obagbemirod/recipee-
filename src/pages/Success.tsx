import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    jumbleberry: any;
  }
}

const Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get('transaction_id') || '';
  const orderValue = searchParams.get('order_value') || '';

  useEffect(() => {
    // Initialize Jumbleberry tracking
    const script = document.createElement('script');
    script.innerHTML = `
      ;!function(j,u,m,b,l,e){var n="jumbleberry",i="3.2.3",o=function(){o.v==i&&o.e?o.e.apply(o,arguments):o.q.push(arguments)}
      ,a=encodeURIComponent,t=decodeURIComponent,d=j.location;(o.push=o).l=!1,o.q=[],o.v=i,o.duid=function(n){return(
      n=n&&u.cookie.match(RegExp(t("%5Cs*")+n.substr(0,21)+"id=([^;]+)")))?t(n[1].split(".")[0]):""},o.g=function(n,i){return!!(
      i=RegExp("^[^#]*[?&]"+n+"=([^&#]+)").exec(i||d.href))&&t(i[1].replace(/\+/g," "))},o.s=function(n){for(var i=Math.round((
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
      jumbleberry("track", "Purchase", { 
        transaction_id: "${transactionId}", 
        order_value: "${orderValue}" 
      });
    `;
    document.head.appendChild(script);
  }, [transactionId, orderValue]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Thank You!</h1>
        <p className="text-xl text-muted-foreground">Your purchase was successful.</p>
      </div>
    </div>
  );
};

export default Success;