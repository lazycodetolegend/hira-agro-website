import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { HiOutlinePaperAirplane, HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data.message || 'Message sent successfully!');
      setForm({ name: '', email: '', phone: '', message: '' });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputBase = 'w-full bg-transparent border-b text-sm text-ink py-2.5 focus:outline-none transition-colors duration-300 placeholder:text-stone/50';
  const inputNormal = `${inputBase} border-stone/30 focus:border-forest`;
  const inputError = `${inputBase} border-red-400 focus:border-red-500`;

  return (
    <div className="animate-fade-in bg-cream min-h-screen">
      <section className="pt-10 pb-16 md:pb-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column — Info using SectionHeading and Card */}
            <div className="md:col-span-5 space-y-6">
              <SectionHeading
                label="GET IN TOUCH"
                title="Let's talk grain."
                subtitle="Whether you need a custom bulk quote, distribution partnership, or product samples — our team is at your service."
              />

              {/* Stacked info cards */}
              <Card hoverEffect={false} className="p-6 bg-white/80 space-y-5 shadow-xs">
                <div className="flex items-start gap-3.5 pb-4 border-b border-stone/15">
                  <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlinePhone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] tracking-[0.15em] uppercase text-gold font-bold mb-1">Phone</span>
                    <a href="tel:+917977697797" className="text-ink text-sm font-semibold hover:text-forest block">+91 79776 97797</a>
                    <a href="tel:+919823958410" className="text-ink text-sm font-semibold hover:text-forest block">+91 98239 58410</a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pb-4 border-b border-stone/15">
                  <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineMail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] tracking-[0.15em] uppercase text-gold font-bold mb-1">Email</span>
                    <a href="mailto:hiraagroindustry51@gmail.com" className="text-ink text-sm font-semibold hover:text-forest block">
                      hiraagroindustry51@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pb-4 border-b border-stone/15">
                  <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineLocationMarker className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] tracking-[0.15em] uppercase text-gold font-bold mb-1">Address</span>
                    <p className="text-ink text-sm font-medium">Jamshet, Vasantwadi, Ashagad</p>
                    <p className="text-stone text-xs">Tal. Dahanu, Dist. Palghar — 401602</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineClock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] tracking-[0.15em] uppercase text-gold font-bold mb-1">Business Hours</span>
                    <p className="text-ink text-sm font-medium">Sat – Thu: 9:00 AM – 6:00 PM</p>
                    <p className="text-stone text-xs">Friday: Closed</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column — Form using Card and Button components */}
            <div className="md:col-span-7">
              <Card hoverEffect={false} className="p-6 md:p-8 bg-white/90 shadow-sm">
                {submitted ? (
                  <div className="flex flex-col items-start justify-center py-10">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-forest mb-5">
                      <HiOutlinePaperAirplane className="w-7 h-7 rotate-45" />
                    </div>
                    <h3 className="font-heading text-3xl text-ink font-bold mb-3">Message sent.</h3>
                    <p className="text-stone text-sm leading-relaxed mb-6 max-w-md">
                      Thank you for contacting Hira Agro Industry. One of our sales representatives will reach out to you with rates and details within 24 hours.
                    </p>
                    <Button variant="secondary" onClick={() => setSubmitted(false)}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl text-ink font-bold mb-2">Send us a message</h3>
                    <p className="text-stone text-xs mb-8">
                      Fill out the form below with your requirements and we will get back to you promptly.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] tracking-[0.1em] uppercase text-stone font-bold mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. Rajesh Shah"
                            className={errors.name ? inputError : inputNormal}
                          />
                          {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[0.1em] uppercase text-stone font-bold mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="you@company.com"
                            className={errors.email ? inputError : inputNormal}
                          />
                          {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase text-stone font-bold mb-2">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+91 79776 97797"
                          className={inputNormal}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase text-stone font-bold mb-2">Message / Bulk Requirements *</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows="4"
                          placeholder="Specify desired rice variety (Basmati, Kolam, Sella), estimated metric tonnes, and delivery location..."
                          className={`${errors.message ? inputError : inputNormal} resize-none`}
                        />
                        {errors.message && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.message}</p>}
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="w-full justify-center py-3.5 text-sm font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Send Message
                            <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
