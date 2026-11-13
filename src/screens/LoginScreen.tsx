import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal, AuthMode } from '../components/AuthModal';

export const WelcomeScreen: React.FC = () => {
  const { loginAsGuest, setIsGuest, signInWithPassword, signUp } = useAuth();
  const [modalMode, setModalMode] = useState<AuthMode>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setModalMode('welcome');
  };

  const handleAuthSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (modalMode === 'register') {
      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Erro', 'A senha deve conter pelo menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);

    if (modalMode === 'login') {
      const { error } = await signInWithPassword(trimmedEmail, password);
      setLoading(false);

      if (error) {
        Alert.alert('Erro ao entrar', error.message);
        return;
      }

      setIsGuest(false);
      resetForm();
    } else {
      const { data, error } = await signUp(trimmedEmail, password);
      setLoading(false);

      if (error) {
        Alert.alert('Erro ao cadastrar', error.message);
        return;
      }

      if (data.session) {
        setIsGuest(false);
        resetForm();
      } else {
        Alert.alert(
          'Conta criada!',
          'Cadastro realizado. Verifique seu e-mail caso a confirmação seja obrigatória no seu projeto Supabase.'
        );
        setModalMode('login');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.centerContent}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>G</Text>
        </View>

        <Text style={styles.title}>GymFlow</Text>
        <Text style={styles.subtitle}>
          Treinos organizados.{'\n'}Resultados reais.
        </Text>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => setModalMode('login')}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => setModalMode('register')}
        >
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          activeOpacity={0.7}
          onPress={loginAsGuest}
        >
          <Text style={styles.guestButtonText}>Continuar como convidado</Text>
        </TouchableOpacity>
      </View>

      <AuthModal
        visible={modalMode !== 'welcome'}
        mode={modalMode}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        loading={loading}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onChangeConfirmPassword={setConfirmPassword}
        onSubmit={handleAuthSubmit}
        onSwitchMode={() => setModalMode(modalMode === 'login' ? 'register' : 'login')}
        onClose={resetForm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1311',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoBadgeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
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
  secondaryButton: {
    width: '100%',
    backgroundColor: '#0E1311',
    borderColor: '#E5E7EB',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 10,
    marginTop: 4,
  },
  guestButtonText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
});
