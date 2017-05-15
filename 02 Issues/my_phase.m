 function my_phase()
 IC = [1 1; 1 2;1 3;1 4];
 hold on
 for ii = 1:length(IC(:,1))
    [~,X] = ode45(@EOM,[0 50],IC(ii,:));
    u = X(:,1);
    w = X(:,2);
    plot(u,w,'r')
    u = gradient(X(:,1));
    v = gradient(X(:,2));
    quiver(X(:,1),X(:,2),u,v);
end
xlabel('u')
ylabel('w')
grid
end 