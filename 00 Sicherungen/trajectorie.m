
%ZEITLÖSUNG:
%ohne Anfangswerte!

function [x]=trajectorie(A)

[eigenvector, eigenwert] = eig(A)

lambda1 = eigenwert(1,1)
lambda2 = eigenwert(2,2)

%eigenwert1:
v = eigenvector(1, 1:2)
w = eigenvector (2, 1:2)


hold on
for i = -20:1:20
C1 = i;
C2 = C1;
t = -30:0.1:30;
x1 = C1*v(1)*exp(lambda1*t)+C2*w(1)*exp(lambda2*t);
x2 = C1*v(2)*exp(lambda1*t)+C2*w(2)*exp(lambda2*t);
plot(x1,x2,'b');
xlim([-2 2])
ylim([-2 2])
end


end