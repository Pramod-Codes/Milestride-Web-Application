import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Bike,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex.morgan@milestride.io");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("milestride-theme") as "dark" | "light") || "dark"
  );
  const isLight = theme === "light";
  const mapBackground = isLight
    ? "https://cdn.builder.io/api/v1/image/assets%2F36d1078c17f94b889fd933421ec3f094%2Fd303d7ff6788498d879bc7bdc1124262"
    : "https://cdn.builder.io/api/v1/image/assets%2F36d1078c17f94b889fd933421ec3f094%2F990fa8dd05ce4bbabcc1ccc9faf75496";

  useEffect(() => {
    localStorage.setItem("milestride-theme", theme);
    document.documentElement.dataset.milestrideTheme = theme;
  }, [theme]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Enter your work email and password to continue.");
      return;
    }
    setError("");
    navigate("/overview");
  };

  return (
    <main className={`ms-login h-[100dvh] overflow-hidden selection:bg-[#3edb85]/30 ${isLight ? "ms-login-light bg-[#f1f5f2] text-[#1f2d24]" : "bg-[#101214] text-white"}`}>
      <div className="flex h-full min-h-0 flex-col lg:flex-row">
        <section className={`ms-login-panel relative hidden h-full min-h-0 overflow-hidden border-r lg:flex lg:w-[53%] lg:flex-col ${isLight ? "border-black/[0.08] bg-[#f1f5f2]" : "border-white/[0.07] bg-[#151817]"}`}>
          <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:62px_62px]" />
          <div className="absolute -left-32 top-24 h-[430px] w-[430px] rounded-full bg-[#3edb85]/10 blur-[110px]" />
          <div className="absolute bottom-[-130px] right-[-40px] h-[470px] w-[470px] rounded-full bg-[#3e83db]/10 blur-[120px]" />

          <div className="relative z-10 flex items-center gap-3 px-8 py-5 xl:px-12 xl:py-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#3edb85]/40 bg-[#3edb85]/10 text-[#5ce69a]">
              <Bike className="h-4 w-4" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Milestride</span>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-start px-8 pb-4 pt-3 lg:pt-4 xl:justify-center xl:px-16 xl:pb-6 xl:pt-2">
            <div className="mb-4 max-w-xl xl:mb-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3edb85]/20 bg-[#3edb85]/[0.08] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#63e99e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4fe28d] shadow-[0_0_12px_#4fe28d]" />
                Fleet Operations
              </div>
              <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-white xl:text-[50px]">
                Keep every mile <span className="text-[#54dc92]">moving.</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-6 text-[#98a29d]">
                One calm command center for your fleet, hubs, and the decisions that keep your network running.
              </p>
            </div>

            <div className={`ms-login-preview relative max-w-[600px] overflow-hidden rounded-2xl border shadow-2xl shadow-black/30 backdrop-blur-sm ${isLight ? "border-black/[0.09] bg-white/90" : "border-white/[0.09] bg-[#1a1e1c]/90"}`}>
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(115deg,transparent_0%,transparent_47%,rgba(132,145,139,.12)_48%,transparent_49%),linear-gradient(25deg,transparent_0%,transparent_48%,rgba(132,145,139,.12)_49%,transparent_50%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:auto,auto,38px_38px,38px_38px]" />
              <div className="relative p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between xl:mb-5">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#71807a]">Live network</p>
                    <p className="mt-1 text-[14px] font-medium text-[#dce5df]">Tuesday, 09:42 AM</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-2.5 py-1.5 text-[11px] text-[#9aa79f]"><span className="h-1.5 w-1.5 rounded-full bg-[#4ee18d]" /> All systems nominal</div>
                </div>
                <div className="ms-login-map relative h-[145px] overflow-hidden rounded-xl border border-white/[0.07] bg-[#171b19] xl:h-[170px]" style={{ backgroundImage: `url(${mapBackground})`, backgroundPosition: "center", backgroundSize: "cover" }}>
                  <div className="absolute left-[17%] top-[26%] h-px w-[75%] rotate-[28deg] bg-white/[0.09]" />
                  <div className="absolute left-[-5%] top-[58%] h-px w-[90%] rotate-[-12deg] bg-white/[0.09]" />
                  <div className="absolute left-[46%] top-[-20%] h-[150%] w-px rotate-[17deg] bg-white/[0.08]" />
                  <div className="absolute left-[62%] top-[15%] h-[95%] w-px rotate-[68deg] bg-white/[0.07]" />
                  <MapPin className="absolute left-[19%] top-[45%] h-7 w-7 fill-[#48dd88] text-[#48dd88] drop-shadow-[0_0_8px_#48dd88]" />
                  <MapPin className="absolute left-[61%] top-[27%] h-7 w-7 fill-[#edb546] text-[#edb546] drop-shadow-[0_0_8px_#edb546]" />
                  <MapPin className="absolute left-[76%] top-[66%] h-7 w-7 fill-[#ef655a] text-[#ef655a] drop-shadow-[0_0_8px_#ef655a]" />
                  <div className="absolute left-[15%] top-[62%] rounded-md border border-white/[0.08] bg-[#111513]/90 px-2 py-1 text-[9px] text-[#ced7d1]">Global Tech Park <span className="ml-1 text-[#55e397]">12</span></div>
                  <div className="absolute right-[12%] top-[15%] rounded-md border border-white/[0.08] bg-[#111513]/90 px-2 py-1 text-[9px] text-[#ced7d1]">University Campus <span className="ml-1 text-[#e7bd58]">10</span></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-white/[0.08] bg-[#111513]/90 px-2.5 py-1.5 text-[10px] text-[#b7c2bb]"><span className="h-1.5 w-1.5 rounded-full bg-[#49dc89]" /> 4 active hubs</div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 xl:mt-4">
                  <div><p className="text-xl font-semibold tracking-[-0.04em] text-[#eff8f1]">30</p><p className="mt-1 text-[10px] text-[#75827b]">Available vehicles</p></div>
                  <div><p className="text-xl font-semibold tracking-[-0.04em] text-[#eff8f1]">97<span className="text-sm text-[#8d9992]">%</span></p><p className="mt-1 text-[10px] text-[#75827b]">Zone compliance</p></div>
                  <div><p className="text-xl font-semibold tracking-[-0.04em] text-[#eff8f1]">4.8<span className="text-sm text-[#8d9992]">k</span></p><p className="mt-1 text-[10px] text-[#75827b]">Trips this week</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between px-8 pb-4 text-[11px] text-[#67726c] xl:px-20"><span>© 2026 Milestride</span><span>Built for teams in motion</span></div>
        </section>

        <section className={`ms-login-auth relative flex h-full min-h-0 flex-1 items-start justify-center overflow-hidden px-5 py-6 sm:px-10 sm:py-8 lg:px-16 lg:py-10 xl:px-24 ${isLight ? "bg-[#f8fbf9]" : "bg-[#101214]"}`}>
          <div className="w-full max-w-[410px]">
            <div className="mb-6 flex items-center gap-3 sm:mb-8 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#3edb85]/40 bg-[#3edb85]/10 text-[#5ce69a]"><Bike className="h-4 w-4" /></div>
              <span className="text-[15px] font-semibold">Milestride</span>
            </div>
            <div className="mb-6 sm:mb-8 lg:mb-9">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#58dd96]">Welcome back</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#f3f7f4] sm:text-[34px]">Sign in to your workspace</h2>
              <p className="mt-3 text-sm leading-6 text-[#88948d]">Monitor your network and keep your fleet moving.</p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <label className="block"><span className="mb-2 block text-xs font-medium text-[#c1cbc4]">Work email</span><div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#65736b]" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@company.com" className="ms-login-input h-12 w-full rounded-lg border border-white/[0.1] bg-[#191d1c] pl-10 pr-4 text-sm text-[#f0f5f1] outline-none transition placeholder:text-[#5f6a64] focus:border-[#43d989] focus:ring-2 focus:ring-[#43d989]/15" /></div></label>
              <label className="block"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-[#c1cbc4]">Password</span><button type="button" className="text-[11px] font-medium text-[#55dc93] transition hover:text-[#8aefb6]">Forgot password?</button></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#65736b]" /><input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="ms-login-input h-12 w-full rounded-lg border border-white/[0.1] bg-[#191d1c] pl-10 pr-11 text-sm text-[#f0f5f1] outline-none transition placeholder:text-[#5f6a64] focus:border-[#43d989] focus:ring-2 focus:ring-[#43d989]/15" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#65736b] transition hover:text-[#c7d3cb]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
              <div className="flex items-center justify-between pt-1"><label className="flex cursor-pointer items-center gap-2.5 text-xs text-[#8d9992]"><input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-[#191d1c] accent-[#43d989]" /> Remember me</label><div className="flex items-center gap-1.5 text-[11px] text-[#6f7c74]"><ShieldCheck className="h-3.5 w-3.5 text-[#55dc93]" /> Secure workspace</div></div>
              {error && <p className="rounded-md border border-[#ef655a]/20 bg-[#ef655a]/10 px-3 py-2 text-xs text-[#ff9c93]">{error}</p>}
              <button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4bdc8b] text-sm font-semibold text-[#0d1912] shadow-[0_10px_30px_rgba(66,220,139,.13)] transition hover:bg-[#64e59c] focus:outline-none focus:ring-2 focus:ring-[#65e69d]/60 focus:ring-offset-2 focus:ring-offset-[#101214]">Sign in to Milestride <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
            </form>
            <p className="mt-5 text-center text-xs sm:mt-7 lg:mt-8 text-[#718078]">New to Milestride? <Link to="/overview" className="font-medium text-[#55dc93] hover:text-[#8aefb6]">Request access</Link></p>
            <p className="mt-8 text-center text-[10px] sm:mt-10 lg:mt-16 leading-5 text-[#56625b]">By signing in, you agree to the Milestride <button className="underline decoration-[#56625b] underline-offset-2 hover:text-[#9aa79f]">Terms of Service</button> and <button className="underline decoration-[#56625b] underline-offset-2 hover:text-[#9aa79f]">Privacy Policy</button>.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
