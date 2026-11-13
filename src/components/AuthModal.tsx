import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

export type AuthMode = 'welcome' | 'login' | 'register';

interface AuthModalProps {
  visible: boolean;
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSubmit: () => void;
  onSwitchMode: () => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  mode,
  email,
  password,
  confirmPassword,
  loading,
  onChangeEmail,
  onChangePassword,
  onChangeConfirmPassword,
  onSubmit,
  onSwitchMode,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />

            <Text style={styles.modalTitle}>
              {mode === 'login' ? 'Entrar na Conta' : 'Criar Conta'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {mode === 'login'
                ? 'Acesse seus treinos e acompanhe seu progresso.'
                : 'Cadastre-se para começar a registrar seus treinos.'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#71717A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={onChangeEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#71717A"
              secureTextEntry
              value={password}
              onChangeText={onChangePassword}
            />

            {mode === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                placeholderTextColor="#71717A"
                secureTextEntry
                value={confirmPassword}
                onChangeText={onChangeConfirmPassword}
              />
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {mode === 'login' ? 'Entrar' : 'Cadastrar'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchModeButton} onPress={onSwitchMode}>
              <Text style={styles.switchModeText}>
                {mode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entrar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#181E1B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    alignItems: 'center',
  },
  modalIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#374151',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#232A26',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2F3833',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 14,
    padding: 8,
  },
  switchModeText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '500',
  },
  closeModalButton: {
    marginTop: 6,
    padding: 8,
  },
  closeModalText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
