import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { invoicesList, owner, subscriptionPlans, vehicles, type InvoiceItem } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';

type PaymentMethod = 'wave' | 'orange' | 'mtn' | 'card';

export default function SubscriptionScreen() {
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [invoices, setInvoices] = useState<InvoiceItem[]>(invoicesList);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wave');
  const [isProcessing, setIsProcessing] = useState(false);

  const activePlan = subscriptionPlans.find((p) => p.id === selectedPlanId) || subscriptionPlans[1];

  function handleProcessPayment() {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPayModalVisible(false);

      const newInv: InvoiceItem = {
        id: `inv-${Date.now()}`,
        number: `FAC-2026-09-${Math.floor(Math.random() * 900 + 100)}`,
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        amount: activePlan.price,
        status: 'payee',
        period: 'Septembre 2026',
      };

      setInvoices((prev) => [newInv, ...prev]);
      Alert.alert(
        'Paiement Réussi !',
        `Votre abonnement mensuel (${activePlan.name}) a été renouvelé avec succès pour 30 jours via ${
          selectedMethod === 'wave' ? 'Wave' : selectedMethod === 'orange' ? 'Orange Money' : selectedMethod === 'mtn' ? 'MTN MoMo' : 'Carte Bancaire'
        }.`
      );
    }, 1500);
  }

  function handleDownloadInvoice(inv: InvoiceItem) {
    Alert.alert('Facture ' + inv.number, `Facture de ${inv.amount} pour la période ${inv.period} (Payée le ${inv.date}). Reçu PDF téléchargé dans vos documents.`);
  }

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Abonnement & Forfaits</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Active Subscription Banner */}
      <View style={styles.activeCard}>
        <View style={styles.activeTop}>
          <View>
            <Text style={styles.activeLabel}>ABONNEMENT EN COURS</Text>
            <Text style={styles.activePlanName}>{owner.planName}</Text>
          </View>
          <Badge label="• Actif" tone="success" />
        </View>

        <View style={styles.activeDetails}>
          <View style={styles.activeDetailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.white} />
            <Text style={styles.activeDetailText}>Prochain renouvellement : {owner.nextBillingDate}</Text>
          </View>
          <View style={styles.activeDetailRow}>
            <Ionicons name="car-sport-outline" size={16} color={Colors.white} />
            <Text style={styles.activeDetailText}>{vehicles.length} balises GPS actives couvertes</Text>
          </View>
          <View style={styles.activeDetailRow}>
            <Ionicons name="cash-outline" size={16} color={Colors.white} />
            <Text style={styles.activeDetailText}>Montant mensuel : {owner.monthlyAmount}</Text>
          </View>
        </View>

        <Pressable style={styles.payNowBtn} onPress={() => setPayModalVisible(true)}>
          <Ionicons name="card-outline" size={18} color={Colors.primary} />
          <Text style={styles.payNowBtnText}>Payer / Renouveler maintenant</Text>
        </Pressable>
      </View>

      {/* Plans comparison */}
      <Text style={styles.sectionTitle}>CHOISIR OU CHANGER DE FORFAIT</Text>
      {subscriptionPlans.map((plan) => {
        const isCurrent = plan.id === selectedPlanId;
        return (
          <Pressable
            key={plan.id}
            onPress={() => setSelectedPlanId(plan.id)}
            style={[styles.planCard, isCurrent && styles.planCardActive]}>
            <View style={styles.planHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  {plan.price} <Text style={styles.planPeriod}>{plan.billingPeriod}</Text>
                </Text>
              </View>
              {plan.recommended ? <Badge label="Recommandé" tone="primary" /> : null}
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.planFooter}>
              {isCurrent ? (
                <View style={styles.currentBadge}>
                  <Ionicons name="checkmark" size={14} color={Colors.primary} />
                  <Text style={styles.currentBadgeText}>Forfait Actuel</Text>
                </View>
              ) : (
                <Pressable
                  style={styles.selectPlanBtn}
                  onPress={() => {
                    setSelectedPlanId(plan.id);
                    Alert.alert('Forfait sélectionné', `Vous avez basculé vers le ${plan.name}.`);
                  }}>
                  <Text style={styles.selectPlanBtnText}>Sélectionner ce forfait</Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        );
      })}

      {/* Invoices History */}
      <Text style={styles.sectionTitle}>HISTORIQUE DES FACTURES & REÇUS</Text>
      <View style={styles.invoicesCard}>
        {invoices.map((inv, idx) => (
          <View key={inv.id} style={[styles.invoiceRow, idx !== invoices.length - 1 && styles.invoiceBorder]}>
            <View style={styles.invoiceIcon}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.invoiceNumber}>{inv.number}</Text>
              <Text style={styles.invoiceMeta}>
                {inv.period} • {inv.date}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
              <Text style={styles.invoiceAmount}>{inv.amount}</Text>
              <Badge label="Payée" tone="success" />
            </View>
            <Pressable style={styles.downloadBtn} onPress={() => handleDownloadInvoice(inv)}>
              <Ionicons name="download-outline" size={18} color={Colors.textSecondary} />
            </Pressable>
          </View>
        ))}
      </View>

      {/* Modal - Paiement Mensuel */}
      <Modal visible={payModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Règlement Mensuel</Text>
              <Pressable onPress={() => setPayModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </Pressable>
            </View>

            <View style={styles.paySummaryBox}>
              <Text style={styles.paySummaryPlan}>{activePlan.name}</Text>
              <Text style={styles.paySummaryAmount}>{activePlan.price}</Text>
              <Text style={styles.paySummaryPeriod}>Valable pour 30 jours de suivi WhatsGPS & Télématique</Text>
            </View>

            <Text style={styles.modalSectionTitle}>CHOISIR LE MODE DE PAIEMENT</Text>

            <View style={styles.paymentMethods}>
              <Pressable
                onPress={() => setSelectedMethod('wave')}
                style={[styles.payMethodCard, selectedMethod === 'wave' && styles.payMethodActive]}>
                <View style={[styles.payMethodIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#0284C7" />
                </View>
                <Text style={styles.payMethodName}>Wave CI</Text>
                {selectedMethod === 'wave' && <Ionicons name="radio-button-on" size={18} color={Colors.primary} />}
              </Pressable>

              <Pressable
                onPress={() => setSelectedMethod('orange')}
                style={[styles.payMethodCard, selectedMethod === 'orange' && styles.payMethodActive]}>
                <View style={[styles.payMethodIcon, { backgroundColor: '#FFEDD5' }]}>
                  <Ionicons name="wallet-outline" size={20} color="#EA580C" />
                </View>
                <Text style={styles.payMethodName}>Orange Money</Text>
                {selectedMethod === 'orange' && <Ionicons name="radio-button-on" size={18} color={Colors.primary} />}
              </Pressable>

              <Pressable
                onPress={() => setSelectedMethod('mtn')}
                style={[styles.payMethodCard, selectedMethod === 'mtn' && styles.payMethodActive]}>
                <View style={[styles.payMethodIcon, { backgroundColor: '#FEF08A' }]}>
                  <Ionicons name="cash-outline" size={20} color="#CA8A04" />
                </View>
                <Text style={styles.payMethodName}>MTN MoMo</Text>
                {selectedMethod === 'mtn' && <Ionicons name="radio-button-on" size={18} color={Colors.primary} />}
              </Pressable>

              <Pressable
                onPress={() => setSelectedMethod('card')}
                style={[styles.payMethodCard, selectedMethod === 'card' && styles.payMethodActive]}>
                <View style={[styles.payMethodIcon, { backgroundColor: '#F1F5F9' }]}>
                  <Ionicons name="card-outline" size={20} color="#334155" />
                </View>
                <Text style={styles.payMethodName}>Carte Bancaire (Visa/Mastercard)</Text>
                {selectedMethod === 'card' && <Ionicons name="radio-button-on" size={18} color={Colors.primary} />}
              </Pressable>
            </View>

            <View style={{ height: 16 }} />
            <Button
              label={isProcessing ? 'Traitement du paiement…' : `Confirmer le paiement (${activePlan.price})`}
              onPress={handleProcessPayment}
              disabled={isProcessing}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  activeCard: {
    backgroundColor: Colors.mapNavy,
    borderRadius: Radius.xl,
    padding: 18,
    marginBottom: 20,
    ...Shadow.button,
  },
  activeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  activeLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  activePlanName: { fontSize: 20, fontWeight: '800', color: Colors.white, marginTop: 4 },
  activeDetails: { gap: 8, marginBottom: 16 },
  activeDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeDetailText: { color: '#E2E8F0', fontSize: 13, fontWeight: '500' },
  payNowBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payNowBtnText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 10, marginTop: 8 },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    ...Shadow.soft,
  },
  planCardActive: { borderColor: Colors.primary, borderWidth: 2 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  planName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  planPrice: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginTop: 2 },
  planPeriod: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  featuresList: { gap: 6, marginBottom: 14 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: Colors.text, flex: 1 },
  planFooter: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, alignItems: 'flex-end' },
  currentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4 },
  currentBadgeText: { color: Colors.primary, fontWeight: '800', fontSize: 13 },
  selectPlanBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, backgroundColor: Colors.primarySoft },
  selectPlanBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  invoicesCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 24,
    ...Shadow.soft,
  },
  invoiceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  invoiceBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  invoiceIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  invoiceNumber: { fontWeight: '700', color: Colors.text, fontSize: 13 },
  invoiceMeta: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  invoiceAmount: { fontWeight: '800', color: Colors.text, fontSize: 13 },
  downloadBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  paySummaryBox: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 14, alignItems: 'center', marginBottom: 16 },
  paySummaryPlan: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  paySummaryAmount: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginVertical: 4 },
  paySummaryPeriod: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  modalSectionTitle: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 10 },
  paymentMethods: { gap: 8 },
  payMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  payMethodActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  payMethodIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  payMethodName: { flex: 1, fontWeight: '700', color: Colors.text, fontSize: 13 },
});
