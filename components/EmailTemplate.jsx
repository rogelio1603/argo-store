import { Section, Img, Text, Heading, Button, Container, Row, Column, Hr } from "@react-email/components";

export default function EmailTemplate({ firstName, lastName, paymentId, amount, currency, items = [], payer = {} }) {
    const formatAmount = (amount, currency) => {
        const currencySymbol = currency === 'MXN' ? '$' : currency;
        return `${currencySymbol}${amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    };

    const fullName = `${firstName} ${lastName}`.trim();

    return (
        <Container style={{ maxWidth: '680px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Header con imagen principal */}
            <Section style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '20px 0' }}>
                <Img
                    alt="Argo Store"
                    width={680}
                    height={200}
            src="https://react.email/static/braun-collection.jpg"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                />
            </Section>

            {/* Contenido principal */}
            <Section style={{ backgroundColor: '#ffffff', padding: '40px 40px 20px 40px', textAlign: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: '600', color: '#22c55e', margin: '0 0 16px 0', lineHeight: '28px' }}>
                ✅ ¡Pago Confirmado!
            </Text>
                <Heading style={{ fontSize: '32px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0', lineHeight: '40px' }}>
                Gracias por tu compra, {fullName}
            </Heading>
                <Text style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 32px 0', lineHeight: '24px' }}>
                Tu pago ha sido procesado exitosamente. A continuación encontrarás los detalles de tu pedido.
                </Text>
                
                {/* Detalles del pedido */}
                <Section style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px', margin: '0 0 32px 0' }}>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 16px 0' }}>
                    📋 DETALLES DEL PEDIDO
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 8px 0', lineHeight: '20px' }}>
                    Número de pedido: <span style={{ fontWeight: '600', color: '#111827' }}>#{paymentId}</span>
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0', lineHeight: '20px' }}>
                    Monto total: <span style={{ fontWeight: '600', color: '#dc2626', fontSize: '16px' }}>{formatAmount(amount, currency)}</span>
                    </Text>
                </Section>

                {/* Tabla de productos - Responsive */}
                {items && items.length > 0 && (
                    <Section style={{ margin: '0 0 32px 0' }}>
                        <Text style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0', textAlign: 'left' }}>
                        🛍️ Productos comprados
                        </Text>
                        
                        {/* Versión Desktop - Tabla */}
                        <Section style={{ display: 'none', '@media screen and (min-width: 600px)': { display: 'block' } }}>
                            <Section style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                {/* Header de la tabla */}
                                <Section style={{ backgroundColor: '#e5e7eb', padding: '14px', borderRadius: '8px 8px 0 0', marginBottom: '2px' }}>
                                    <Row>
                                        <Column style={{ width: '18%', textAlign: 'center', padding: '0 8px' }}>
                                            <Text style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>IMAGEN</Text>
                                        </Column>
                                        <Column style={{ width: '32%', textAlign: 'center', padding: '0 8px' }}>
                                            <Text style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PRODUCTO</Text>
                                        </Column>
                                        <Column style={{ width: '30%', textAlign: 'center', padding: '0 8px' }}>
                                            <Text style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DESCRIPCIÓN</Text>
                                        </Column>
                                        <Column style={{ width: '10%', textAlign: 'center', padding: '0 4px' }}>
                                            <Text style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CANT.</Text>
                                        </Column>
                                        <Column style={{ width: '10%', textAlign: 'center', padding: '0 4px' }}>
                                            <Text style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PRECIO</Text>
                                        </Column>
                                    </Row>
                                </Section>
                                
                                {/* Filas de productos - Desktop */}
                                {items.map((item, index) => (
                                    <Section key={index} style={{ 
                                        backgroundColor: '#ffffff', 
                                        padding: '16px 12px', 
                                        borderRadius: index === items.length - 1 ? '0 0 8px 8px' : '0',
                                        marginBottom: index === items.length - 1 ? '0' : '2px',
                                        border: '1px solid #f3f4f6'
                                    }}>
                                        <Row style={{ alignItems: 'center' }}>
                                            <Column style={{ width: '18%', textAlign: 'center', verticalAlign: 'middle', padding: '0 8px' }}>
                                                <Img
                                                    src={item.picture_url}
                                                    alt={item.title}
                                                    width={65}
                                                    height={80}
                                                    style={{ 
                                                        borderRadius: '8px', 
                                                        objectFit: 'cover', 
                                                        display: 'block', 
                                                        margin: '0 auto',
                                                        border: '1px solid #e5e7eb'
                                                    }}
                                                />
                                            </Column>
                                            <Column style={{ width: '32%', textAlign: 'center', verticalAlign: 'middle', padding: '0 8px' }}>
                                                <Text style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '0', lineHeight: '18px' }}>
                                                    {item.title}
                                                </Text>
                                            </Column>
                                            <Column style={{ width: '30%', textAlign: 'center', verticalAlign: 'middle', padding: '0 8px' }}>
                                                <Text style={{ fontSize: '11px', color: '#6b7280', margin: '0', lineHeight: '16px' }}>
                                                    {item.description}
                                                </Text>
                                            </Column>
                                            <Column style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle', padding: '0 4px' }}>
                                                <Text style={{ fontSize: '13px', fontWeight: '600', color: '#111827', margin: '0' }}>
                                                    {item.quantity}
                                                </Text>
                                            </Column>
                                            <Column style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle', padding: '0 4px' }}>
                                                <Text style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626', margin: '0' }}>
                                                    {formatAmount(item.unit_price, currency)}
                                                </Text>
                                            </Column>
                                        </Row>
                                    </Section>
                                ))}
                            </Section>
                        </Section>
                    </Section>
                )}

                {/* Dirección de envío */}
                {payer && (payer.address || payer.colonia || payer.city || payer.state || payer.zip_code) && (
                    <Section style={{ backgroundColor: '#dbeafe', padding: '24px', borderRadius: '12px', margin: '0 0 32px 0', border: '1px solid #93c5fd' }}>
                        <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', margin: '0 0 16px 0', textAlign: 'left' }}>
                        📍 DIRECCIÓN DE ENVÍO
                        </Text>
                        <Text style={{ fontSize: '14px', color: '#1e40af', margin: '0', lineHeight: '22px', textAlign: 'left' }}>
                            {payer.address && (
                                <span><strong>Dirección:</strong> {payer.address}<br /></span>
                            )}
                            {payer.colonia && (
                                <span><strong>Colonia:</strong> {payer.colonia}<br /></span>
                            )}
                            {payer.city && (
                                <span><strong>Ciudad:</strong> {payer.city}<br /></span>
                            )}
                            {payer.alcaldia && (
                                <span><strong>Alcaldía:</strong> {payer.alcaldia}<br /></span>
                            )}
                            {payer.state && (
                                <span><strong>Estado:</strong> {payer.state}<br /></span>
                            )}
                            {payer.zip_code && (
                                <span><strong>Código Postal:</strong> {payer.zip_code}<br /></span>
                            )}
                            {payer.references && (
                                <span><strong>Referencias:</strong> {payer.references}</span>
                            )}
            </Text>
                    </Section>
                )}
                
                <Hr style={{ margin: '32px 0', borderColor: '#e5e7eb' }} />
                
                <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0', lineHeight: '20px' }}>
                📦 Recibirás otro correo con el número de rastreo una vez que tu pedido sea enviado.
            </Text>
                
                <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
                        href="https://argo-store.com"
                        style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            padding: '16px 32px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '16px',
                            display: 'inline-block',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Visitar nuestra tienda
            </Button>
        </Section>
        </Section>

            {/* Logo de Argo Store al final */}
            <Section style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '40px 0' }}>
                <Img
                    src="https://argo-store.com/logo.avif"
                    alt="Argo Store Logo"
                    width={120}
                    height={120}
                    style={{ display: 'block', margin: '0 auto', borderRadius: '8px' }}
                />
                <Text style={{ fontSize: '12px', color: '#9ca3af', margin: '16px 0 0 0' }}>
                    © 2024 Argo Store. Todos los derechos reservados.
                </Text>
            </Section>
        </Container>
    )
}