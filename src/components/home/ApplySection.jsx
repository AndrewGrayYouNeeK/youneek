import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, Upload, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ApplySection() {
  const [formData, setFormData] = useState({
    pet_name: '',
    pet_type: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    emergency_description: '',
    vet_clinic_name: '',
    vet_clinic_address: '',
    estimated_cost: '',
    amount_requested: '',
  });
  const [petPhoto, setPetPhoto] = useState(null);
  const [documentation, setDocumentation] = useState(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      let pet_photo_url = null;
      let documentation_url = null;

      if (petPhoto) {
        // Disabled to prevent credit usage; will switch to Cloudinary backend.
        console.warn('Pet photo upload disabled pending Cloudinary setup.');
      }

      if (documentation) {
        // Disabled to prevent credit usage; will switch to Cloudinary backend.
        console.warn('Documentation upload disabled pending Cloudinary setup.');
      }

      return base44.entities.VetAssistanceApplication.create({
        ...data,
        estimated_cost: parseFloat(data.estimated_cost) || 0,
        amount_requested: parseFloat(data.amount_requested) || 0,
        pet_photo_url,
        documentation_url,
        status: 'pending'
      });
    },
    onSuccess: () => {
      setSuccess(true);
      setFormData({
        pet_name: '',
        pet_type: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
        emergency_description: '',
        vet_clinic_name: '',
        vet_clinic_address: '',
        estimated_cost: '',
        amount_requested: '',
      });
      setPetPhoto(null);
      setDocumentation(null);
      queryClient.invalidateQueries(['funded-applications']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <section id="apply" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-3xl p-12"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
            <p className="text-white/60 mb-8">
              Thank you for reaching out. We review applications within 24-48 hours. 
              You'll receive an email at the address you provided.
            </p>
            <Button onClick={() => setSuccess(false)} className="bg-white/10 hover:bg-white/20 text-white">
              Submit Another Application
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Need <span className="text-orange-400">Help?</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            If your pet is facing a life-threatening emergency and you can't afford the vet bill, 
            apply below. We're here to help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Alert className="bg-orange-500/10 border-orange-500/30 mb-8">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <AlertDescription className="text-white/80">
              We only fund <strong>emergency, life-threatening</strong> situations. 
              Funds are sent directly to the veterinary clinic, not to individuals.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pet Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-400" />
                  Pet Information
                </h3>
                
                <div>
                  <Label className="text-white/70">Pet Name *</Label>
                  <Input
                    value={formData.pet_name}
                    onChange={(e) => handleChange('pet_name', e.target.value)}
                    placeholder="e.g., Max"
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label className="text-white/70">Pet Type *</Label>
                  <Select value={formData.pet_type} onValueChange={(v) => handleChange('pet_type', v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/70">Pet Photo</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPetPhoto(e.target.files[0])}
                      className="hidden"
                      id="pet-photo"
                      disabled
                    />
                    <label 
                      htmlFor="pet-photo"
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 transition-colors"
                    >
                      {petPhoto ? (
                        <span className="text-white/70">{petPhoto.name}</span>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-white/40" />
                          <span className="text-white/40">Upload photo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Your Information</h3>
                
                <div>
                  <Label className="text-white/70">Your Name *</Label>
                  <Input
                    value={formData.owner_name}
                    onChange={(e) => handleChange('owner_name', e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label className="text-white/70">Email *</Label>
                  <Input
                    type="email"
                    value={formData.owner_email}
                    onChange={(e) => handleChange('owner_email', e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <Label className="text-white/70">Phone</Label>
                  <Input
                    value={formData.owner_phone}
                    onChange={(e) => handleChange('owner_phone', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Emergency Details */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-white">Emergency Details</h3>
                
                <div>
                  <Label className="text-white/70">Describe the Emergency *</Label>
                  <Textarea
                    value={formData.emergency_description}
                    onChange={(e) => handleChange('emergency_description', e.target.value)}
                    placeholder="Please describe your pet's medical emergency and why it's life-threatening..."
                    required
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Vet Clinic Name *</Label>
                    <Input
                      value={formData.vet_clinic_name}
                      onChange={(e) => handleChange('vet_clinic_name', e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Vet Clinic Address</Label>
                    <Input
                      value={formData.vet_clinic_address}
                      onChange={(e) => handleChange('vet_clinic_address', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">Estimated Total Cost (USD) *</Label>
                    <Input
                      type="number"
                      value={formData.estimated_cost}
                      onChange={(e) => handleChange('estimated_cost', e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Amount Requesting (USD) *</Label>
                    <Input
                      type="number"
                      value={formData.amount_requested}
                      onChange={(e) => handleChange('amount_requested', e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white/70">Upload Vet Documentation (estimates, bills, etc.)</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocumentation(e.target.files[0])}
                      className="hidden"
                      id="documentation"
                      disabled
                    />
                    <label 
                      htmlFor="documentation"
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-white/40 transition-colors"
                    >
                      {documentation ? (
                        <span className="text-white/70">{documentation.name}</span>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-white/40" />
                          <span className="text-white/40">Upload documentation (PDF, images)</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-6 text-lg rounded-xl"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}